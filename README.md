# AI Tool & Prompt Directory (Monetized Micro-SaaS)

A production-ready, fully automated directory for AI tools, prompt packs, and digital assets. Built with a premium dark UI, seamless **Stripe** payment integration, and a secure **Supabase** backend.

This project is fully optimized for production deployment (e.g., Vercel) and designed to be easily managed by non-technical operators.

---

## 🚀 Core Features

- **Dual-Submission Pipeline:** Users can submit tools for free (sent to a manual moderation queue) or pay **$49** via Stripe for an instant featured listing.
- **Premium Dark UI:** Modern, responsive design built with Tailwind CSS and sleek layout structures.
- **Robust Security:** Database access is strictly guarded by Supabase **Row Level Security (RLS)** policies.
- **Automated Payment Handling:** Secure Stripe Webhooks listen for successful checkouts and instantly update production data without manual intervention.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Database & Auth:** Supabase (PostgreSQL)
- **Payments:** Stripe API (Checkout & Webhooks)

---

## ⚙️ Getting Started & Local Setup

Follow these steps to get the project running locally in under 3 minutes.

### 1. Clone the repository and install dependencies
```bash
npm install
```
### 2. Set up Environment Variables
Create a .env.local file in the root directory and populate it with your credentials:

```dotenv
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_secret_service_role_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_test_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_cli_webhook_secret

# App Settings
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
(Note: Never commit your .env.local file to GitHub! It is already added to .gitignore)
### 3. Run the development server
```bash
npm run dev
```
Open http://localhost:3000 with your browser to see the result.

---

## 📦 Database Schema & RLS
The database runs on Supabase (PostgreSQL). It includes an assets table with fields for tracking approval status, premium tier status, and Stripe checkout session IDs.

Row Level Security (RLS) is enabled to ensure public users can query approved tools safely, while the admin webhook uses the service_role key to update premium status upon payment confirmation.

---

## 📈 Deployment & Production Scaling
This architecture is optimized for 1-click deployment on Vercel.
To move to production:

1. Link this repository to Vercel.

2. Add your production environment variables in the Vercel Dashboard.

3. Replace NEXT_PUBLIC_SITE_URL with your live production domain.

4. Set up a live production Webhook endpoint in your Stripe Dashboard pointing to https://your-domain.com/api/webhook/stripe.