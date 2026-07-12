<div align="center">
  <br />
  <img src="public/images/Aurum_Logo.png" alt="AURUM Logo" width="280" style="filter: invert(1);"/>
  <br />
  <br />

  # A U R U M

  **Worn by the universe. Made for you.**

  [![Next.js](https://img.shields.io/badge/Next.js_14-000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![PostgreSQL](https://img.shields.io/badge/NeonDB-00E599?logo=postgresql&logoColor=white)](https://neon.tech/)
  [![Three.js](https://img.shields.io/badge/Three.js-000?logo=threedotjs&logoColor=white)](https://threejs.org/)
  [![Drizzle](https://img.shields.io/badge/Drizzle_ORM-C5F74F?logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
  [![License](https://img.shields.io/badge/License-MIT-C69B3C)](LICENSE)

  <br />

  <sub>An ultra-luxury, cinematic e-commerce platform for high-end jewellery — featuring generative 3D WebGL models, scroll-driven storytelling, live market pricing, and a bespoke admin maison.</sub>

</div>

<br />

---

## 🌌 Vision

Every atom of gold in a fine jewellery piece was forged inside a collapsing star billions of years ago. **AURUM** captures that cosmic origin story through an immersive digital experience that rivals the luxury of a physical atelier.

Built for a hackathon, engineered like a maison.

---

## ✨ Features

### 🎬 Cinematic Storefront
| Feature | Description |
|---|---|
| **Scroll-Driven Storytelling** | 5-chapter narrative from cosmic origins to checkout, powered by GSAP & Framer Motion |
| **Generative 3D Ring** | Procedurally generated gold ring with diamond, rendered via React Three Fiber & custom shaders |
| **Loading Ceremony** | Luxury loading screen with logo reveal, progress bar, and dramatic entrance animation |
| **Live Market Ticker** | Real-time gold, diamond, platinum & gemstone rates displayed in the navbar |

### 🛍️ Full E-Commerce
| Feature | Description |
|---|---|
| **Dynamic Pricing Engine** | Product prices calculated live from metal weight × market rate + gemstone × rate + making charges + 3% GST |
| **Gemstone Variants** | Admin can add multiple stone variants (Diamond, Ruby, Sapphire, Emerald) with individual images & carat weights |
| **Variant-Aware Cart** | Same product with different stones/sizes tracked as separate line items |
| **Wishlist** | Persistent wishlist with "Move to Cart" functionality |
| **Checkout Flow** | Multi-step checkout with address, payment, and order confirmation |

### 🏛️ Admin Maison
| Feature | Description |
|---|---|
| **Product Management** | Create, edit, and delete products with drag-and-drop image uploads to Supabase Storage |
| **Bulk Operations** | Select multiple products and delete in batch |
| **Market Rates** | View and update live rates for all metals and gemstones |
| **Variant Editor** | Add/remove gemstone variants per product with image preview |
| **Dashboard Metrics** | Total products, recent additions at a glance |

### 🔐 Auth & Security
| Feature | Description |
|---|---|
| **Google OAuth** | Powered by NextAuth.js v5 (Auth.js) with role-based access |
| **Admin Guard** | All `/admin` and `/api/admin/*` routes are session-protected |
| **Account Dropdown** | Navbar shows signed-in status, admin link, and logout |

---

## 🛠️ Tech Stack

<table>
  <tr>
    <td><b>Layer</b></td>
    <td><b>Technology</b></td>
  </tr>
  <tr>
    <td>Framework</td>
    <td>Next.js 14 (App Router, Server Components)</td>
  </tr>
  <tr>
    <td>Language</td>
    <td>TypeScript</td>
  </tr>
  <tr>
    <td>Styling</td>
    <td>Tailwind CSS, Framer Motion, CSS Custom Properties</td>
  </tr>
  <tr>
    <td>3D & WebGL</td>
    <td>React Three Fiber, Drei, Three.js Postprocessing, GSAP</td>
  </tr>
  <tr>
    <td>Database</td>
    <td>NeonDB (Serverless PostgreSQL)</td>
  </tr>
  <tr>
    <td>ORM</td>
    <td>Drizzle ORM</td>
  </tr>
  <tr>
    <td>Authentication</td>
    <td>NextAuth.js v5 (Auth.js) — Google OAuth</td>
  </tr>
  <tr>
    <td>Storage</td>
    <td>Supabase Storage (product images)</td>
  </tr>
  <tr>
    <td>State</td>
    <td>Zustand (persisted cart & wishlist)</td>
  </tr>
  <tr>
    <td>Payments</td>
    <td>Razorpay</td>
  </tr>
</table>

---

## 📁 Project Structure

```
AURUM/
├── src/
│   ├── app/
│   │   ├── (home)            # Cinematic landing page
│   │   ├── shop/             # Product grid + product detail pages
│   │   ├── cart/             # Variant-aware shopping cart
│   │   ├── checkout/         # Multi-step checkout
│   │   ├── account/wishlist/ # Persistent wishlist
│   │   ├── admin/            # Admin dashboard (protected)
│   │   ├── auth/             # Sign-in page
│   │   └── api/              # REST API routes
│   │       ├── products/     # Public product listing
│   │       ├── rates/        # Live market rates
│   │       └── admin/        # Protected admin CRUD
│   ├── components/
│   │   ├── three/            # 3D models, scenes, shaders
│   │   ├── scroll/           # Scroll chapters (1–5)
│   │   ├── shop/             # ProductCard, filters
│   │   └── ui/               # Navbar, LoadingScreen, Footer
│   ├── store/                # Zustand stores (cart, wishlist, UI)
│   └── lib/                  # DB, schema, pricing, auth, helpers
├── public/images/            # Static assets & logo
├── drizzle.config.ts         # Drizzle ORM configuration
└── next.config.mjs           # Next.js + Three.js webpack config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ & npm
- **NeonDB** account → [neon.tech](https://neon.tech)
- **Supabase** project → [supabase.com](https://supabase.com) (for image storage)
- **Google Cloud** OAuth credentials → [console.cloud.google.com](https://console.cloud.google.com)
- **Razorpay** test account → [razorpay.com](https://razorpay.com)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Kavya-Jain-coder/AURUM.git
cd AURUM

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your NeonDB, Supabase, Google OAuth, and Razorpay keys

# 4. Push the database schema
npx drizzle-kit push

# 5. Start the development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** — the cinematic loading screen will greet you.

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://...@neon.tech/aurum

# Authentication
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Supabase (Image Storage)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Razorpay
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
```

---

## 💼 Admin Portal

Navigate to `/admin` after signing in with an authorized Google account.

| Capability | Details |
|---|---|
| **Add Products** | Name, slug, collection, metal type, weight, gemstone, carat, making charges, description |
| **Upload Images** | Drag-and-drop to Supabase Storage with instant preview |
| **Gemstone Variants** | Add Ruby, Sapphire, Emerald variants with separate images and carat weights |
| **Bulk Delete** | Select multiple products with checkboxes and delete in one action |
| **Market Rates** | View current live rates for all tracked materials |

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `aurum-void` | `#0A0A0A` | Page backgrounds |
| `aurum-obsidian` | `#1A1A1A` | Card backgrounds |
| `aurum-gold` | `#C69B3C` | Primary accent, CTAs |
| `aurum-cream` | `#F5F0E8` | Headings, primary text |
| `aurum-ruby` | `#8B1A2E` | Danger states, Ruby variant |
| `font-display` | Playfair Display | Headings & titles |
| `font-body` | Inter | Body text & labels |
| `font-accent` | JetBrains Mono | Prices & data |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <br />
  <sub>Built with ♥ for the love of gold, code, and stardust.</sub>
  <br />
  <br />
  <a href="https://github.com/Kavya-Jain-coder/AURUM">
    <img src="https://img.shields.io/badge/⭐_Star_this_repo-C69B3C?style=for-the-badge" alt="Star" />
  </a>
</div>
