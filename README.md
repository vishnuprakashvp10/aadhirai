# 🏛️ Aadhirai — Full-Stack Divine Statue eCommerce

A complete, production-ready Next.js 14 eCommerce website for Aadhirai — Curated Indian Goods.

## ✨ Features

### Customer-Facing
- **Homepage** — Stunning hero, marquee strip, featured categories, featured products, artisan story, testimonials, blog preview
- **Products** — Full catalogue with filters (deity, material, price), sorting, grid/list view, search
- **Product Detail** — Image gallery, specifications, quantity selector, add to cart, reviews, related products
- **Cart** — Persistent cart (localStorage), quantity management, free shipping calculator
- **Checkout** — Full shipping form, Razorpay payment gateway integration
- **Order Confirmation** — Real-time order details, status timeline
- **Blogs** — 10 pre-written divine articles with categories, featured post, full article pages with sidebar
- **About** — Brand story, timeline, team, mission
- **Contact** — Contact form with quick FAQ

### Admin Panel (`/admin`)
- **Dashboard** — Revenue stats, recent orders, inventory alerts, quick actions
- **Orders** — Full order list with search/filter, click-to-view detail panel, status updater
- **Products** — List with stock toggle, CRUD, image manager, full product form
- **Blogs** — List with publish/unpublish toggle, rich blog editor
- **Customers** — Customer list with lifetime value stats
- **Analytics** — Revenue/order bar charts, pie chart by order status, line chart trends, top products table
- **Settings** — Store info, shipping rates, payment config, notifications, security

### Technical
- **Next.js 14** App Router with Server Components for performance
- **Supabase** PostgreSQL database with RLS security policies
- **Razorpay** payment gateway with webhook verification
- **SEO** — Dynamic sitemap, robots.txt, OpenGraph, JSON-LD ready
- **Fully responsive** — Mobile-first design, works on all screen sizes
- **TypeScript** throughout
- **Optimised** — Image optimization, font optimization, server-side rendering

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier works)
- Razorpay account (test mode for development)

---

## 📦 Step-by-Step Setup

### Step 1 — Install Dependencies

```bash
cd aadhirai
npm install
```

---

### Step 2 — Set Up Supabase

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Note your **Project URL** and **anon key** from Settings → API
3. Also note the **service_role key** (keep this secret!)
4. Go to **SQL Editor** in Supabase dashboard
5. Paste and run the entire contents of `supabase-schema.sql`
   - This creates all tables, RLS policies, and inserts sample data

---

### Step 3 — Set Up Razorpay

1. Go to [razorpay.com](https://razorpay.com) → Create account
2. Dashboard → Settings → API Keys → Generate Test Keys
3. Note your **Key ID** and **Key Secret**
4. Go to Webhooks → Add webhook URL: `https://your-domain.com/api/webhook/razorpay`
5. Select events: `payment.captured`, `payment.failed`, `refund.created`
6. Note the **Webhook Secret**

---

### Step 4 — Configure Environment Variables

Copy the example env file:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in all values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=xxxx
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxx

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-a-32-char-random-string-here

RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

> **Generate NEXTAUTH_SECRET:** Run `openssl rand -base64 32` in terminal

---

### Step 5 — Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

### Step 6 — Access Admin Panel

Go to [http://localhost:3000/admin](http://localhost:3000/admin)

The admin panel is accessible directly at `/admin/dashboard`. In production, protect it with middleware (see Security section below).

---

## 🌐 Deploy to Vercel

### Method 1 — Vercel CLI
```bash
npm i -g vercel
vercel
```

### Method 2 — Vercel Dashboard
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Connect your GitHub repo
4. Add all environment variables from `.env.local`
5. Deploy!

> **Important:** After deploying, update `NEXT_PUBLIC_APP_URL` to your Vercel URL, and update the Razorpay webhook URL to `https://your-vercel-app.vercel.app/api/webhook/razorpay`

---

## 🔒 Production Security

### Protect the Admin Panel
Add `src/middleware.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get('admin_token')?.value;
    if (!token || token !== process.env.ADMIN_TOKEN) {
      return NextResponse.redirect(new URL('/admin-login', req.url));
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
```

---

## 📁 Project Structure

```
aadhirai/
├── src/
│   ├── app/
│   │   ├── (main)/              # Customer-facing pages
│   │   │   ├── page.tsx         # Homepage
│   │   │   ├── about/
│   │   │   ├── products/
│   │   │   │   └── [slug]/      # Product detail
│   │   │   ├── blogs/
│   │   │   │   └── [slug]/      # Blog detail
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   └── order-confirmation/
│   │   ├── (admin)/             # Admin panel
│   │   │   └── admin/
│   │   │       ├── dashboard/
│   │   │       ├── orders/
│   │   │       ├── products/
│   │   │       ├── blogs/
│   │   │       ├── customers/
│   │   │       ├── analytics/
│   │   │       └── settings/
│   │   └── api/                 # API routes
│   │       ├── products/
│   │       ├── orders/
│   │       ├── blogs/
│   │       ├── payment/
│   │       │   ├── create-order/
│   │       │   └── verify/
│   │       ├── webhook/razorpay/
│   │       └── newsletter/
│   ├── components/
│   │   ├── layout/              # Navbar, Footer, AnnouncementBar
│   │   ├── home/                # Homepage sections
│   │   ├── products/            # ProductCard, ProductsClient, ProductDetailClient
│   │   └── admin/               # All admin components
│   ├── context/
│   │   └── CartContext.tsx      # Cart state (localStorage)
│   ├── lib/
│   │   └── supabase/            # Client & Server Supabase utilities
│   ├── types/
│   │   └── index.ts             # All TypeScript types
│   └── utils/
│       └── index.ts             # formatPrice, generateOrderNumber, etc.
├── supabase-schema.sql          # Complete DB schema + sample data
├── .env.local.example           # Environment template
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary Green | `#053726` |
| Gold Accent | `#E1A730` |
| Font Display | Cormorant Garamond |
| Font Body | Jost |
| Font Accent | Cinzel |

---

## 🛠️ Common Customisations

### Add a new product category
1. Add to `CATEGORIES` array in `ProductsClient.tsx`
2. Add to the TypeScript type in `types/index.ts`
3. Run `ALTER TABLE products DROP CONSTRAINT ...` and re-add with new value in Supabase

### Change shipping threshold
Edit `src/app/(main)/cart/page.tsx` and `checkout/page.tsx`:
```typescript
const shipping = total >= 5000 ? 0 : 299; // Change 5000 and 299
```

### Add product images via Supabase Storage
1. Supabase Dashboard → Storage → Create bucket `aadhirai-assets` (public)
2. Upload images → Copy public URL
3. Paste URL in Admin → Products → Add Product → Image URL field

---

## 📞 Support

For issues, check:
1. Supabase logs: Dashboard → Logs
2. Vercel logs: Dashboard → Functions
3. Browser console for client-side errors

---

Built with ❤️ for Aadhirai — Preserving India's Sacred Sculptural Heritage
#   a a d h i r a i  
 