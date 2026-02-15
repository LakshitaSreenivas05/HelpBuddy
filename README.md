## Help Buddy

Help Buddy is a full-stack web marketplace that connects people who need assistance with trusted, verified helpers in their area. It is built on the Next.js App Router, uses Prisma as the ORM, and stores data in a Neon-hosted PostgreSQL database. Users can browse helper profiles, create booking requests, manage their profile, and leave reviews.

## Features

- 🔐 **Authentication & Authorization** – Credentials-based login powered by NextAuth, role-based access for helpers and requesters, and protected API routes with middleware.
- 👥 **Profile Management** – Rich profiles for both helpers and requesters, including skills, languages, availability, hourly rate, and verification status.
- 🔍 **Searchable Marketplace** – Filter helpers by keywords, location, and services. Featured helpers surface on the landing page.
- 📅 **Booking Workflow** – Requesters can submit booking requests, helpers can confirm/decline/complete bookings, and both parties can view histories.
- ⭐ **Ratings & Reviews** – Requesters can leave feedback and ratings after completed bookings; helper averages are automatically recalculated.
- 📱 **Responsive UI** – Modern, mobile-first interface with reusable UI primitives and consistent theming.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Database:** Neon PostgreSQL
- **ORM:** Prisma 5
- **Authentication:** NextAuth.js (credentials)
- **Styling:** Tailwind CSS 4 (with custom components)
- **Language:** TypeScript
- **Package Manager:** pnpm

## Project Structure

```
app/
  api/                 # Route handlers for auth, helpers, bookings, profile, reviews
  helpers/             # Public helper listing & detail pages
  dashboard/           # Authenticated area for requesters/helpers
  (auth)/              # Login & registration flows
  layout.tsx           # Global layout with navigation & footer
components/
  auth/                # Authentication forms
  bookings/            # Booking creation & action components
  helpers/             # Helper cards and search UI
  layout/              # Header, footer, logout button
  profile/             # Profile management form
  providers/           # Session provider wrapper
  ui/                  # Reusable UI primitives (button, input, card, etc.)
lib/
  auth.ts              # NextAuth configuration and helpers
  data/                # Domain data fetch helpers
  prisma.ts            # Prisma client singleton
  serializers.ts       # Common serialization utilities
  utils.ts             # Formatters and helpers
  validators/          # Zod schemas for validation
prisma/
  schema.prisma        # Database schema definitions
env.example            # Template for required environment variables
```

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Copy the example file and populate values:

```bash
cp env.example .env.local
```

| Variable          | Description                                                                |
| ----------------- | -------------------------------------------------------------------------- |
| `DATABASE_URL`    | Neon PostgreSQL connection string (`sslmode=require` recommended).         |
| `NEXTAUTH_SECRET` | 32+ character secret for NextAuth JWT encryption (`openssl rand -hex 32`). |
| `NEXTAUTH_URL`    | The canonical base URL (e.g. `http://localhost:3000` in development).      |

> ℹ️ Neon automatically provides a pooled connection string—use it for best performance.

### 3. Generate Prisma client & run migrations

```bash
pnpm prisma generate
pnpm prisma migrate dev --name init
```

If you already have a production database, run `pnpm prisma migrate deploy` during deployment instead.

### 4. Start the development server

```bash
pnpm dev
```

Visit `http://localhost:3000` to explore Help Buddy locally.

## Scripts

| Command              | Description                                    |
| -------------------- | ---------------------------------------------- |
| `pnpm dev`           | Start the Next.js development server.          |
| `pnpm build`         | Create an optimized production build.          |
| `pnpm start`         | Serve the production build.                    |
| `pnpm lint`          | Run ESLint (TypeScript + accessibility rules). |
| `pnpm prisma studio` | Explore the database via Prisma Studio.        |

## Prisma Data Model

Key models include:

- `User` with `UserRole` enum (`REQUESTER`, `HELPER`, `ADMIN`)
- `Profile` and `HelperProfile` for extended metadata
- `Booking` with status transitions (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `DECLINED`)
- `Review` tied to completed bookings
- Default NextAuth tables (`Account`, `Session`, `VerificationToken`)

Refer to `prisma/schema.prisma` for full definitions.

## API Overview

| Route                     | Method(s)  | Description                                                 |
| ------------------------- | ---------- | ----------------------------------------------------------- |
| `/api/auth/[...nextauth]` | `GET/POST` | NextAuth credential sign-in/out.                            |
| `/api/register`           | `POST`     | Create new account with role.                               |
| `/api/profile`            | `GET/PUT`  | Fetch or update authenticated user profile.                 |
| `/api/helpers`            | `GET`      | Search helpers by query/location/services.                  |
| `/api/helpers/:id`        | `GET`      | Fetch detailed helper profile and reviews.                  |
| `/api/bookings`           | `GET/POST` | List bookings for current user or create new booking.       |
| `/api/bookings/:id`       | `PATCH`    | Update booking status (confirm, complete, cancel, decline). |
| `/api/reviews`            | `POST`     | Submit review after completed booking.                      |

All non-public routes are protected by NextAuth middleware.

## Deployment Notes

- Set production environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`) in your hosting provider (Vercel recommended).
- Run `pnpm prisma migrate deploy` during deployment to apply schema changes.
- Ensure the Neon connection string allows connections from your hosting region and uses the pooled connection for serverless environments.
- When hosting on Vercel, add the `DATABASE_URL` and `NEXTAUTH_SECRET` via the dashboard and redeploy.

## Testing & Future Enhancements

- Add automated tests (Playwright + Jest) for booking flows.
- Integrate email notifications for booking changes.
- Support helper availability calendars with time slots.
- Allow helpers to upload verification documents via secure storage.

## License

This project is provided for demonstration purposes. Apply your own licensing terms before distribution.
