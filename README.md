# Mustafa Dost FreshMart

A mobile-friendly grocery storefront built with Next.js, TypeScript, Prisma, and PostgreSQL. Browse a broad grocery catalog, search and filter departments, add products to a local cart, and use customer and admin workflows when a database is configured.

## Documentation

- [Project guide](docs/PROJECT_GUIDE.md): setup, routes, catalog maintenance, and deployment notes.
- [GitHub upload guide](docs/GITHUB_UPLOAD.md): step-by-step repository publishing and secret checks.

## Features

- Responsive grocery storefront and category browsing
- 12 departments, with at least 20 sample products per department
- Product search, department filters, and price sorting
- Browser-local shopping cart
- Customer registration, login, and Cash on Delivery checkout
- Admin product and order management
- Seed catalog fallback for browsing when PostgreSQL is unavailable

The fallback keeps catalog browsing available, but database-backed features such as accounts, checkout, and order persistence require a working PostgreSQL database.

## Departments

Fruits, Vegetables, Dairy Products, Meat and Chicken, Bakery Items, Beverages, Snacks, Rice and Grains, Cooking Oil, Spices, Frozen Foods, and Household Items.

## Tech Stack

- Next.js App Router and React
- TypeScript
- Prisma ORM and PostgreSQL
- Tailwind CSS
- JWT sessions and bcrypt password hashing

## Requirements

- Node.js 20.9 or later
- npm
- PostgreSQL

## Run Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your local environment file:

   ```bash
   cp .env.example .env
   ```

   In PowerShell, you can use `Copy-Item .env.example .env`.

3. Edit `.env` and set `DATABASE_URL`, a unique `JWT_SECRET`, `SEED_ADMIN_EMAIL`, and `SEED_ADMIN_PASSWORD`. Use a random session secret and an admin password of at least 12 characters. Keep `.env` private.

4. Generate the Prisma client and create the database tables:

   ```bash
   npm run db:generate
   npm run db:push
   ```

5. Seed the sample departments, products, and admin account:

   ```bash
   npm run db:seed
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000).

To create a random session secret with Node.js, run:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Useful Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Generate Prisma Client and build the app |
| `npm start` | Start the production server after building |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Apply the Prisma schema to the database |
| `npm run db:seed` | Seed sample catalog data and the configured admin account |

## Main Routes

| Route | Description |
| --- | --- |
| `/` | Storefront home |
| `/shop` | Search and browse products |
| `/categories` | Browse grocery departments |
| `/cart` | Shopping cart |
| `/checkout` | Cash on Delivery checkout |
| `/login` and `/register` | Customer authentication |
| `/admin` | Admin dashboard |
| `/admin/products` | Product management |
| `/admin/orders` | Order management |

## GitHub and Secrets

- Commit `.env.example`, not `.env` or other local environment files.
- `.gitignore` excludes environment files while allowing `.env.example` to be shared.
- Use unique credentials for every deployment; never reuse development passwords or session secrets.
- Configure production environment variables in your hosting provider rather than committing them.

## Deployment Notes

Deploy to a Node.js host such as Vercel and provision a managed PostgreSQL database. Set the required environment variables in the hosting dashboard. For production database changes, use Prisma migrations and run `prisma migrate deploy`. Do not rely on the local catalog fallback for orders or account data.

Online payments are not enabled. The contact form does not yet send messages, and the cart is stored in the browser rather than synced across devices. Review authentication, rate limiting, backups, monitoring, and payment integrations before production use.
