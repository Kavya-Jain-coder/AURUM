import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;          // in paise
  quantity: number;
  material: string;       // 'yellow-gold' | 'white-gold' | 'rose-gold' | 'platinum'
  stone: string;          // 'Diamond VVS-EF' | 'Ruby' | 'Sapphire' | 'Emerald'
  size?: string;
  imagePath: string;
  modelPath: string;
}

/**
 * Generate a unique key for a cart item based on its product + variant combo.
 * This ensures that different stones/sizes/materials of the same product
 * are tracked independently in the cart.
 */
function cartItemKey(item: { productId: string; material: string; stone: string; size?: string }) {
  return `${item.productId}__${item.material}__${item.stone}__${item.size || ''}`;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, material: string, stone: string, size?: string) => void;
  updateQuantity: (productId: string, material: string, stone: string, size: string | undefined, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => set((state) => {
        const key = cartItemKey(item);
        const existing = state.items.find((i) => cartItemKey(i) === key);
        if (existing) {
          return {
            items: state.items.map((i) =>
              cartItemKey(i) === key
                ? { ...i, quantity: i.quantity + item.quantity, price: item.price }
                : i
            ),
          };
        }
        return { items: [...state.items, item] };
      }),

      removeItem: (productId, material, stone, size) => set((state) => ({
        items: state.items.filter((i) => cartItemKey(i) !== cartItemKey({ productId, material, stone, size })),
      })),

      updateQuantity: (productId, material, stone, size, quantity) => set((state) => {
        const key = cartItemKey({ productId, material, stone, size });
        return {
          items: quantity <= 0
            ? state.items.filter((i) => cartItemKey(i) !== key)
            : state.items.map((i) =>
                cartItemKey(i) === key ? { ...i, quantity } : i
              ),
        };
      }),

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'aurum-cart',
    }
  )
);
