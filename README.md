# Makeup Studio — Frontend Starter

Next.js 14 (App Router, plain JS) + Tailwind CSS, built mobile-first for the Express
backend starter. Every page is responsive: single-column/stacked on mobile, expanding
to wider layouts at the `sm:`/`md:` Tailwind breakpoints, with a hamburger nav below
640px.

## Pages

- `/` — hero, services grid, staff grid
- `/book` — step-by-step booking flow: service → staff → date/time → contact info →
  OTP verification → confirmation with Application ID
- `/status` — look up a booking by Application ID; reschedule or cancel, each gated
  behind a fresh OTP (2FA) check
- `/reviews` — approved reviews feed + review submission form

## Structure

- `lib/api.js` — every backend call in one file (fetch wrapper with consistent error handling)
- `components/` — `Header` (responsive nav), `Footer`, `ServiceCard`, `StaffCard`,
  `OtpVerifyBlock` (reusable send/verify UI used on the booking page)
- `app/` — one folder per route (App Router convention), plus `layout.js` (shared
  header/footer + viewport meta) and `globals.css` (Tailwind + small reusable classes
  like `.btn-primary`, `.input-field`, `.card`)

## Running it

```bash
cp .env.local.example .env.local   # point NEXT_PUBLIC_API_URL at your backend
npm install
npm run dev     # runs on :3001 (backend runs on :3000)
```

Make sure the backend's `FRONTEND_ORIGIN` env var matches this frontend's URL
(`http://localhost:3001` in dev) so CORS allows the requests through.

## What's intentionally left for you to finish

- Real images for services/staff (Cloudinary URLs come from the backend once seeded)
- Loading skeletons / nicer empty states
- Form validation polish (phone number format, etc.)
- SEO metadata per page beyond the root default
- Deploy to Vercel: set `NEXT_PUBLIC_API_URL` to your deployed backend URL as an
  environment variable in the Vercel project settings
