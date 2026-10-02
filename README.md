# TN78 Men's Wear - Storefront & Admin Frontend

Modern, high-performance Next.js 14 e-commerce storefront and admin dashboard for **TN78 Men's Collection**.

Built with Next.js App Router, React 18, TypeScript, and Tailwind CSS.

---

## 🚀 Features

- **Storefront**:
  - Responsive, modern mobile-first UI with dark/light aesthetics
  - Dynamic product catalog with filters, categories, and search
  - Interactive Outfit Builder & "Find My Fit" sizing calculator
  - Live dispatch countdown timer & PIN code delivery estimator
  - Persistent Cart & Wishlist with local storage and guest syncing
  - Full checkout flow with Razorpay, UPI QR, and Cash on Delivery
  - Order tracking and user account / orders history
  - Customer review submission with image upload support

- **Admin Portal (`/admin`)**:
  - Real-time order management and status update workflow
  - Product catalog CRUD, variant controls, and inventory management
  - Coupon creation and discount rule management
  - Return requests review and tracking
  - Customer review moderation and response

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Icons**: Lucide React / SVG
- **State Management**: React Context & Hooks

---

## ⚙️ Environment Variables

Create a `.env.local` file for development or configure these environment variables in your deployment platform (e.g. Vercel, Netlify):

```env
# Backend API Base URL (Point to your deployed backend service)
NEXT_PUBLIC_API_URL=https://your-backend-api.com

# Razorpay & Payment Gateway Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
NEXT_PUBLIC_UPI_VPA=your-business-vpa@bank

# Supabase Storage (For media & product assets)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_STORAGE_BUCKET=products
```

---

## 💻 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Production Deployment (e.g. Vercel)

This repository is structured as a standalone Next.js root application ready for one-click deployment:

1. Import this repository in [Vercel](https://vercel.com) or your preferred hosting platform.
2. Set Framework Preset to **Next.js**.
3. Root Directory: `./` (default).
4. Add the environment variables listed above (especially `NEXT_PUBLIC_API_URL`).
5. Click **Deploy**!