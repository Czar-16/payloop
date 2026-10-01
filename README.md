# Payloop

Payloop is a full-stack digital wallet and payment application inspired by Paytm/PhonePe, built to demonstrate payment system design, atomic balance operations, server-to-server webhook security, and peer-to-peer money transfers.

---

## 🚀 Architecture & Tech Stack

### Monorepo Structure (Turborepo + npm Workspaces)
```
payloop/
├── apps/
│   ├── user-payloop/     # Next.js App Router digital wallet client & backend API (Port 3000)
│   └── bank-webhook/     # Express server simulating external bank webhooks (Port 4000)
├── packages/
│   ├── db/               # Prisma 7 client package connected to PostgreSQL
│   ├── ui/               # Shared React UI component library
│   ├── typescript-config/# Shared TS configuration
│   └── eslint-config/    # Shared ESLint configuration
├── docker-compose.yml / Docker CLI setup
├── package.json
└── turbo.json
```

### Core Technologies
- **Framework:** Next.js 16 (App Router), Express.js
- **Database:** PostgreSQL via Docker
- **ORM:** Prisma 7 (`@prisma/adapter-pg`)
- **Authentication:** NextAuth / Auth.js v5 (JWT session strategy, Credentials Provider with Argon2)
- **Validation:** Zod
- **Frontend HTTP Client:** Axios
- **UI Styling:** Tailwind CSS v4, Shared React Components
- **Language:** TypeScript 5.8 (Strict mode, no `any`)

---

## ⚡ Quick Start & Setup

### 1. Prerequisites
- Node.js >= 24
- Docker Desktop or Docker Engine

### 2. Start PostgreSQL via Docker

Run the PostgreSQL Docker container:
```bash
docker run --name payloop-postgres \
  -e POSTGRES_USER=payloop \
  -e POSTGRES_PASSWORD=payloop \
  -e POSTGRES_DB=payloop \
  -p 5432:5432 \
  -d postgres
```
*(If the container already exists, start it using `docker start payloop-postgres`)*.

### 3. Environment Variables

Create `.env` files in `apps/user-payloop/.env` and `apps/bank-webhook/.env` (see `.env.example` templates):

**apps/user-payloop/.env:**
```env
DATABASE_URL="postgresql://payloop:payloop@localhost:5432/payloop"
AUTH_SECRET="your_secure_auth_secret"
WEBHOOK_SECRET="bank_webhook_secret_key"
```

**apps/bank-webhook/.env:**
```env
DATABASE_URL="postgresql://payloop:payloop@localhost:5432/payloop"
WEBHOOK_SECRET="bank_webhook_secret_key"
WEBHOOK_URL="http://localhost:3000/api/webhook"
PORT=4000
```

### 4. Database Setup & Migrations

```bash
# Run migrations and apply database schema
npx prisma migrate dev --schema=packages/db/prisma/schema.prisma

# Generate Prisma Client
npx prisma generate --schema=packages/db/prisma/schema.prisma
```

### 5. Running the Application

Run all services concurrently using Turborepo:
```bash
npm run dev
```

This starts:
- **User Payloop Web App:** [http://localhost:3000](http://localhost:3000)
- **Bank Webhook Mock Server:** [http://localhost:4000](http://localhost:4000)

---

## 💳 Payment & On-Ramp Flow

1. **Transaction Creation:** User enters amount on `/dashboard/add-money`. Frontend posts to `POST /api/onramp`. Payloop creates an `OnRampTransaction` with status `Processing` and generates a unique token.
2. **Bank Simulation:** External Bank processes payment and triggers `POST http://localhost:3000/api/webhook` with `{ token, status: "Success" | "Failed" }` and an HMAC SHA256 signature in header `x-webhook-signature`.
3. **Webhook Verification & Idempotency:**
   - Payloop verifies the HMAC SHA256 signature using `WEBHOOK_SECRET` and timing-safe comparison.
   - Payloop executes an atomic Prisma transaction (`db.$transaction`).
   - Transaction status moves `Processing` → `Success` or `Processing` → `Failed`.
   - On `Success`, `Balance.available` is incremented by `amount`.
   - Duplicate webhooks are ignored idempotently without crediting balance again. Terminal states (`Success`/`Failed`) cannot be overwritten.

---

## 💸 Peer-to-Peer Transfer Flow

1. User enters recipient identifier (email or phone) and amount on `/dashboard/transfer`.
2. Backend (`POST /api/transfer`) authenticates sender session via NextAuth.
3. Payloop locates recipient, validates positive amount, prevents self-transfers, and checks sender available balance.
4. Executes atomic Prisma transaction:
   - Decrements sender `Balance.available`.
   - Increments recipient `Balance.available`.
   - Records `TransferTransaction` (`senderId`, `receiverId`, `amount`, `status: "Success"`).

---

## 🧪 Testing Bank Payment Webhook Manually

To simulate an incoming webhook from the mock bank service:

```bash
# Simulate Successful On-Ramp Payment
curl -X POST http://localhost:4000/simulate-payment \
  -H "Content-Type: application/json" \
  -d '{"token": "YOUR_ONRAMP_TOKEN", "status": "Success"}'

# Simulate Failed On-Ramp Payment
curl -X POST http://localhost:4000/simulate-payment \
  -H "Content-Type: application/json" \
  -d '{"token": "YOUR_ONRAMP_TOKEN", "status": "Failed"}'
```

---

## 🛡️ Security Architecture

- **Password Hashing:** Passwords hashed with Argon2.
- **Session Security:** NextAuth JWT tokens; user ID derived strictly from session authority (`session.user.id`).
- **Server Authorization:** Client-provided `userId` parameters are never trusted for authorization.
- **Webhook Protection:** Server-to-server HMAC SHA256 signature verification with timing-safe string comparison.
- **Input Validation:** All endpoints validated using Zod schemas.
- **Financial Integrity:** All balance mutations executed inside database transactions (`db.$transaction`).

---

## ⚙️ Development Commands

```bash
# Type check all packages
npm run check-types

# Lint all packages
npm run lint

# Production build
npm run build
```
