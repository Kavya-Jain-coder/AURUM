/**
 * Drizzle ORM Schema for AURUM
 *
 * Tables: users, orders, order_items, wishlist_items
 * Ready for NeonDB (PostgreSQL).
 */

import {
  pgTable,
  text,
  timestamp,
  integer,
  serial,
  varchar,
  boolean,
  decimal,
  json,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ─── Products ─────────────────────────────────────────────────────────────
export const productsTable = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  collection: varchar('collection', { length: 50 }).notNull(), // rings, necklaces, bracelets, earrings
  
  // Compositional Pricing Fields
  metalType: varchar('metal_type', { length: 50 }).notNull(), // e.g. 22K Gold, 18K Gold, Platinum 950
  metalWeightGrams: decimal('metal_weight_grams', { precision: 10, scale: 3 }).notNull(),
  gemstoneType: varchar('gemstone_type', { length: 50 }), // e.g. Diamond VVS-EF, None
  gemstoneCarat: decimal('gemstone_carat', { precision: 10, scale: 3 }),
  gemstoneVariants: json('gemstone_variants'), // array of { type, baseCarat, imagePath, color }
  makingCharges: integer('making_charges').default(0).notNull(), // in paise
  baseSize: integer('base_size').default(7), // the size that corresponds to the base metalWeight and gemstoneCarat

  description: text('description'),
  story: text('story'),
  imagePath: text('image_path'),
  modelPath: text('model_path'),
  
  // Display string properties (optional now that we have real data, but good for UI text)
  materialsMetal: text('materials_metal'),
  materialsStone: text('materials_stone'),
  materialsWeight: text('materials_weight'),
  materialsPurity: text('materials_purity'),
  
  inStock: boolean('in_stock').default(true).notNull(),
  rating: integer('rating').default(5).notNull(),
  reviewCount: integer('review_count').default(0).notNull(),
  isNew: boolean('is_new').default(false).notNull(),
  isBestseller: boolean('is_bestseller').default(false).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// ─── Market Rates ─────────────────────────────────────────────────────────
export const marketRates = pgTable('market_rates', {
  id: serial('id').primaryKey(),
  materialType: varchar('material_type', { length: 50 }).notNull(), // 'metal' or 'gemstone'
  materialName: varchar('material_name', { length: 100 }).notNull(), // '22K Gold', 'Diamond VVS-EF'
  ratePerUnit: integer('rate_per_unit').notNull(), // in paise (per gram for metal, per carat for gemstone)
  effectiveDate: timestamp('effective_date', { mode: 'date' }).defaultNow().notNull(),
});

// ─── Users ────────────────────────────────────────────────────────────────
export const users = pgTable('users', {
  id: text('id').primaryKey(), // NextAuth generates string IDs
  name: text('name'),
  email: text('email').unique().notNull(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// ─── Accounts (OAuth providers, used by NextAuth Drizzle adapter) ─────────
export const accounts = pgTable('accounts', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
});

// ─── Verification Tokens (magic link, used by NextAuth) ───────────────────
export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull().unique(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

// ─── Orders ───────────────────────────────────────────────────────────────
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  totalAmount: integer('total_amount').notNull(), // in paise
  currency: varchar('currency', { length: 3 }).notNull().default('INR'),
  razorpayOrderId: text('razorpay_order_id'),
  razorpayPaymentId: text('razorpay_payment_id'),
  shippingName: text('shipping_name'),
  shippingPhone: text('shipping_phone'),
  shippingAddress: text('shipping_address'),
  shippingCity: text('shipping_city'),
  shippingState: text('shipping_state'),
  shippingPincode: text('shipping_pincode'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

// ─── Order Items ──────────────────────────────────────────────────────────
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull(),
  productName: text('product_name').notNull(),
  quantity: integer('quantity').notNull().default(1),
  price: integer('price').notNull(), // in paise
  size: varchar('size', { length: 10 }),
  material: varchar('material', { length: 50 }),
});

// ─── Wishlist ─────────────────────────────────────────────────────────────
export const wishlistItems = pgTable('wishlist_items', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull(),
  addedAt: timestamp('added_at', { mode: 'date' }).defaultNow().notNull(),
});

// ─── Relations ────────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  wishlistItems: many(wishlistItems),
  accounts: many(accounts),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  user: one(users, { fields: [wishlistItems.userId], references: [users.id] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

// ─── Type exports ─────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type WishlistItem = typeof wishlistItems.$inferSelect;
export type DbProduct = typeof productsTable.$inferSelect;
export type NewDbProduct = typeof productsTable.$inferInsert;
