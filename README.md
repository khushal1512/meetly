# Meetly - Office Desk & Room Booking App

Meetly is a clean, modern, and secure single-page application for booking office desks and meeting rooms. It features visual schedule overviews, recurring reservations, and device-bound booking ownership checks to ensure bookings are secure and easy to manage.

## Features

- **Responsive Grid View**: Day view showing time slots (8 AM to 5 PM) for each of the 10 desks.
- **Overlap Detection**: Blocks double-bookings. Allows back-to-back bookings (e.g. one ending exactly when the next begins).
- **Flexible Recurrence**: Ability to specify repeating a weekly booking up to 12 weeks. Checks constraints for all occurrences at once and rejects the entire sequence if any overlapping bookings exist.
- **Booking Owner Tokens**: Prevents other users or incognito sessions from canceling your bookings. Automatically stores a randomized token in the browser's `localStorage` to check cancellation permissions.
- **Optional Booking Notes**: Add a short description to a booking (visible directly on the timeline and on hover tooltip).
- **Cancel Confirmation**: Interactive modal to prevent accidental cancellations.
- **Clean Date Selection**: Robust date selection using `react-day-picker` on the sidebar.

## Prerequisites

- **Node.js** (v18+)
- **pnpm** (preferred) or **npm**
- **PostgreSQL Database** (e.g., Supabase, NeonDB, or local PostgreSQL instance)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd meetly
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root of the project with your database connection URL:

```env
DATABASE_URL="postgresql://username:password@hostname:port/database?sslmode=require"
```

### 4. Database Setup

Synchronize the database schema with Prisma and seed the initial desks:

```bash
# Push the schema to database and generate Prisma client
pnpm exec prisma db push

# (Optional) Seed the database with 10 default desks
pnpm exec prisma db seed
```

*Note: The project requires `@prisma/client` and `prisma` tools. Ensure they generate matching version clients.*

### 5. Run the Application

Start the local development server:

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start scheduling desks!
