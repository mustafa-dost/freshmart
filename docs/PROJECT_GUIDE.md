# FreshMart Project Guide

## Overview

Mustafa Dost FreshMart is a grocery storefront built with Next.js App Router, React, TypeScript, Prisma, and PostgreSQL. The repository contains the storefront, customer account pages, shopping cart, admin pages, API routes, and sample grocery catalog.

The catalog contains 12 departments and at least 20 sample items per department. If PostgreSQL is unavailable, the shop can still render the bundled catalog for browsing. This fallback does not provide persistent accounts, checkout, or orders.

## Repository Map

```text
app/                  Next.js pages and API routes
  api/                Authentication, products, orders, and admin endpoints
  admin/              Admin dashboard, products, and orders
  shop/               Product catalog, filters, search, and sorting
  categories/         Grocery department list
  cart/               Cart page
  checkout/           Checkout page
components/           Shared header, footer, cart, and admin controls
lib/                  Prisma, authentication, and currency helpers
prisma/schema.prisma  PostgreSQL data model
prisma/seed.ts        Department and product seed data
public/               Static assets, when present
```

## Local Development Setup

### Requirements

- Node.js 20.9 or later
- npm
- PostgreSQL

### Install and configure

Run commands from the `freshmart` project directory.

```bash
npm install
```

Copy the sample environment file:

```powershell
Copy-Item .env.example .env
```

Set these values in `.env` before using the database or seed command:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: unique random secret for session signing
- `SEED_ADMIN_EMAIL`: email address for the development admin account
- `SEED_ADMIN_PASSWORD`: unique password at least 12 characters long
- `NEXT_PUBLIC_APP_URL`: base URL used by the shop share link

Keep `.env` private and do not commit it. The `.env.example` file is safe to commit because it uses placeholders.

Create/update the database schema and seed sample records:

```bash
npm run db:generate
npm run db:push
npm run db:seed
```

Run the development server:

```bash
npm run dev
```

Visit `http://localhost:3000`. If port 3000 is already occupied, Next.js may select another port; set `NEXT_PUBLIC_APP_URL` to that server's address when you want the share link to use it.

## Main Pages

| Path | Purpose |
| --- | --- |
| `/` | Storefront home page |
| `/shop` | Product catalog with search, department filter, and price sort |
| `/categories` | Browse the 12 grocery departments |
| `/cart` | Browser-local cart |
| `/checkout` | Cash on Delivery checkout for signed-in customers |
| `/login` | Customer login |
| `/register` | Customer registration |
| `/admin` | Admin overview |
| `/admin/products` | Admin product management |
| `/admin/orders` | Admin order management |

## API Routes

| Method and path | Purpose |
| --- | --- |
| `GET /api/products` | List active products; supports search and category parameters |
| `POST /api/products` | Create a product for an authorized admin |
| `POST /api/orders` | Create an authenticated Cash on Delivery order |
| `POST /api/auth/register` | Register a customer |
| `POST /api/auth/login` | Start a customer session |
| `POST /api/auth/logout` | End the current session |
| `PATCH /api/admin/orders/:id` | Update an order status for an authorized admin |

Order creation is expected to validate prices and stock on the server. Review the API implementation before deploying changes to production.

## Catalog Maintenance

Edit `categories` and `items` in `prisma/seed.ts` to change the sample catalog. Each product record contains a name, department slug, price in PKR, optional sale price, unit, and image URL. Product names generate their slugs, so keep names unique.

Run the seed command after editing the catalog:

```bash
npm run db:seed
```

The seed command requires a reachable PostgreSQL database and valid `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` values in `.env`.

## Useful Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Generate Prisma Client and make a production build |
| `npm start` | Start the production build |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Apply the Prisma schema to the configured database |
| `npm run db:seed` | Add or update sample departments, products, and admin account |

## Current Limitations

- The cart is stored in the browser and is not synchronized across devices.
- Checkout and order persistence require PostgreSQL.
- Online payments are not enabled.
- Contact form submission is not connected to an email or ticket service.
- The bundled catalog fallback supports browsing only; it is not a replacement for a database.

## Production Notes

Before a public production launch:

1. Provision PostgreSQL and configure production environment variables in the hosting provider.
2. Use HTTPS and a unique, high-entropy `JWT_SECRET`.
3. Use Prisma migrations for production schema changes rather than relying on `db push`.
4. Provision the admin account with private credentials; never use sample or shared passwords.
5. Review rate limiting, account recovery, monitoring, database backups, image handling, and payment integration.
6. Set `NEXT_PUBLIC_APP_URL` to the deployed HTTPS origin.
