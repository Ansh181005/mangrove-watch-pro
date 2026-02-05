## Mangrove Watch Pro

An environmental protection dashboard for monitoring incidents in mangrove conservation areas. Built with React + Vite + TypeScript, shadcn/ui, Tailwind CSS, TanStack Query, and Supabase.

**Key Features**
- Admin dashboard with metrics and recent incidents
- Realtime incident trends chart (weekly reports vs resolved)
- Role-protected Admin and User layouts/routes
- User reporting, profile, achievements, and reports pages
- Themed Home page with Sign In / Sign Up

**Tech Stack**
- React 18, TypeScript, Vite
- Tailwind CSS + shadcn/ui components
- TanStack Query for data fetching/caching
- Supabase for auth, database, and realtime
- Recharts for analytics visualizations

### Getting Started

1) Install dependencies

```bash
npm install
```

2) Configure environment

Create a `.env` file in the project root with your Supabase credentials:

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3) Run the dev server

```bash
npm run dev
```

Then open the printed local URL in your browser.

### Build & Preview

```bash
npm run build
npm run preview
```

### Project Structure (excerpt)

- `src/pages/AdminDashboard.tsx` – Admin overview + incident trends
- `src/components/IncidentTrends.tsx` – Weekly chart (reports/resolved) with realtime updates
- `src/lib/supabase.ts` – Supabase client
- `src/pages/Home.tsx` – Themed landing with Sign In/Sign Up
- `public/favicon.svg` – Browser tab icon

### Notes

- The incident trends chart expects an `incidents` table with columns like `id`, `created_at`, `status` (use `resolved` for resolved items). Adjust selectors if your schema differs.
- SQL bootstrap files are provided: `supabase_setup.sql`, `supabase_fix_roles.sql`.

### License

This project is for demonstration and internal use. Add your preferred license if distributing.

