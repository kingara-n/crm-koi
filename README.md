# Koi Travel CRM

A full-stack CRM built for Koi Travel agency to replace legacy spreadsheets.

## Tech Stack
- **Frontend:** Next.js (App Router), Tailwind CSS
- **Backend/DB:** Supabase (Postgres, Auth, Storage, Realtime)
- **Deployment:** Vercel

## Local Setup

1. Run `npm install`
2. Run `npx supabase init` and `npx supabase start` to launch local Supabase instance.
3. Copy `.env.example` to `.env.local` and fill in the local Supabase URLs and keys.
4. Run `npm run dev` to start the Next.js development server on `http://localhost:3000`.

## Deployment to Vercel

1. Push your code to the `main` branch on GitHub.
2. In Vercel, import the `crm-koi` GitHub repository.
3. Add the following environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (if needed for admin actions)
4. Deploy! Vercel will automatically build and deploy the app.

## Data Protection (Legacy Data Import)
When using the Legacy Data Importer to import SafariOffice spreadsheets, all imported data is encrypted at rest by Supabase. Access to this data is strictly governed by Row-Level Security (RLS) policies, ensuring that only authenticated users with appropriate roles (e.g., 'admin', 'operations') can view or edit client details.
