# Payloop

Payloop is a full-stack digital wallet and payment application inspired by Paytm/PhonePe, built to demonstrate payment system design, atomic balance operations, server-to-server webhook security, and peer-to-peer money transfers.

---

## ✨ Features

- **Authentication** — Register with name, email, phone and password; Argon2 hashing, Auth.js JWT sessions.
- **Wallet dashboard** — Available balance, locked (processing) amount, total added, and recent activity feed.
- **Add money (on-ramp)** — Create an on-ramp transaction, pick a bank, and settle it through the mock bank's webhook simulator.
- **Peer-to-peer transfer** — Send money to any registered user by email or phone number.
- **Transaction history** — Combined ledger of money in / money out with status and totals.
- **Financial integrity** — Every balance mutation runs inside a database transaction with idempotent, signature-verified webhook settlement.
- **No client-trusted identity** — Authorization is derived from the server session only.

---

## 📸 Screenshots

**1. Landing Page**

![Home](apps/user-payloop/public/1.png)

**2. Transfer**

![Transfer](apps/user-payloop/public/2.png)

**3. Add money + Bank Webhook Payment Status**

![Add money + Bank Webhook Payment Status](apps/user-payloop/public/3.png)

**4. Bank Webhook (Mock)**

![Bank Webhook (Mock)](apps/user-payloop/public/4.png)

**5. Transactions history**

![Transaction History](apps/user-payloop/public/5.png)

**6. Overview and Locked Balance**

![verview and Locked Balance](apps/user-payloop/public/6.png)

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
├── .env.example       # Template for env values
├── package.json       # npm workspaces root
└── turbo.json         # Turborepo pipeline config
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
- **Package Manager:** npm 11 (workspaces)

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

_(If the container already exists, start it using `docker start payloop-postgres`)_.

### 3. Environment Variables

Create `.env` files in `apps/user-payloop/.env` and `apps/bank-webhook/.env` (copy the values from the root `.env.example`):

**apps/user-payloop/.env:**

```env
DATABASE_URL="postgresql://payloop:payloop@localhost:5432/payloop"
AUTH_SECRET="your_secure_auth_secret"
WEBHOOK_SECRET="bank_webhook_secret_key"
```

**apps/bank-webhook/.env** (the mock bank never touches the database, it only signs and forwards webhooks):

```env
WEBHOOK_SECRET="bank_webhook_secret_key"
WEBHOOK_URL="http://localhost:3000/api/webhook"
PORT=4000
```

`WEBHOOK_SECRET` must be identical in both apps, otherwise the HMAC signature check will reject every webhook.

### 4. Install Dependencies

```bash
npm install
```

### 5. Database Setup & Migrations

```bash
# Run migrations and apply database schema
npx prisma migrate dev --schema=packages/db/prisma/schema.prisma

# Generate Prisma Client
npx prisma generate --schema=packages/db/prisma/schema.prisma
```

### 6. Running the Application

Run all services concurrently using Turborepo:

```bash
npm run dev
```

This starts:

- **User Payloop Web App:** [http://localhost:3000](http://localhost:3000)
- **Bank Webhook Mock Server:** [http://localhost:4000](http://localhost:4000)

Open [http://localhost:3000/register](http://localhost:3000/register), create an account (name, email, phone, password of at least 4 characters), and you land on the dashboard. To test transfers, register a second account in a private window.

---

## 🗺️ Application Routes

| Route                     | Purpose                                                    | Auth required |
| ------------------------- | ---------------------------------------------------------- | ------------- |
| `/register`               | Create a new account                                       | No            |
| `/login`                  | Sign in                                                    | No            |
| `/dashboard`              | Balance, stats, recent activity                            | Yes           |
| `/dashboard/add-money`    | Create an on-ramp transaction and simulate the bank result | Yes           |
| `/dashboard/transfer`     | Send money by recipient email or phone                     | Yes           |
| `/dashboard/transactions` | Full ledger with money in / money out totals               | Yes           |

---

## 🔌 API Reference

| Method | Endpoint           | Description                                              |
| ------ | ------------------ | -------------------------------------------------------- |
| `POST` | `/api/register`    | Create a user (name, email, phone, password)             |
| `GET`  | `/api/auth/*`      | Auth.js session endpoints (sign in / sign out / session) |
| `GET`  | `/api/balance`     | Current user's available and locked amounts              |
| `POST` | `/api/onramp`      | Create an on-ramp transaction, returns payment token     |
| `POST` | `/api/webhook`     | Bank webhook receiver (HMAC signed, idempotent)          |
| `POST` | `/api/transfer`    | Peer-to-peer transfer between two users                  |
| `GET`  | `/api/user/search` | Look up a recipient by email or phone                    |

Mock bank service:

| Method | Endpoint            | Description                                          |
| ------ | ------------------- | ---------------------------------------------------- |
| `GET`  | `/health`           | Health check returning webhook config status         |
| `GET`  | `/`                 | Service status page                                  |
| `GET`  | `/simulate-payment` | Form for manually firing a webhook                   |
| `POST` | `/simulate-payment` | Fire a signed `{ token, status }` webhook at Payloop |

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
3. Payloop locates the recipient by email **or** phone, rejects unknown recipients, rejects self-transfers, and verifies the sender has enough available balance.
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

## 🗄️ Data Model

| Model                 | Purpose                       | Key fields                                                               |
| --------------------- | ----------------------------- | ------------------------------------------------------------------------ |
| `User`                | Account holder                | `name`, `email`, `phone`, `password` (Argon2 hash)                       |
| `Balance`             | Per-user wallet balance       | `available`, `locked`, `userId`                                          |
| `OnRampTransaction`   | Money added via external bank | `amount`, `status` (`Processing` / `Success` / `Failed`), unique `token` |
| `TransferTransaction` | Peer-to-peer transfer record  | `senderId`, `receiverId`, `amount`, `status`                             |

Amounts are stored as `Int` (whole rupees), so there are no floating point rounding errors in the ledger.

- `Balance.available` — spendable credit. Incremented on a successful on-ramp webhook and on incoming transfers; decremented on outgoing transfers.
- `Balance.locked` — reserved column for funds held during a transfer.
- In-flight on-ramp money is tracked separately: the dashboard sums `OnRampTransaction` rows still in `Processing` and shows them as locked, so pending bank settlements are never counted as spendable.

---

## 🛡️ Security Architecture

- **Password Hashing:** Passwords hashed with Argon2.
- **Session Security:** NextAuth JWT tokens; user ID derived strictly from session authority (`session.user.id`).
- **Server Authorization:** Client-provided `userId` parameters are never trusted for authorization.
- **Webhook Protection:** Server-to-server HMAC SHA256 signature over the raw request body, compared with `crypto.timingSafeEqual`. Missing or invalid signatures are rejected with `401` before any DB work.
- **Idempotency:** The webhook updates the transaction with a conditional `updateMany` filtered on `status: "Processing"`, so a replayed webhook affects zero rows and returns `Transaction already processed` without crediting the balance again.
- **Input Validation:** All endpoints validated using Zod schemas (webhook `status` is restricted to `Success` / `Failed`; transfer `amount` must be a positive integer).
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

# Format source
npm run format
```

---

## ❓ Troubleshooting

| Problem                                        | Fix                                                                                       |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `P1001` / `Can't reach database server`        | Start the container (`docker start payloop-postgres`) and confirm port `5432` is free     |
| `Environment variable not found: DATABASE_URL` | Create `apps/user-payloop/.env` from `.env.example` and restart the dev server            |
| Add money stuck on `Processing`                | Fire the webhook manually via `POST /simulate-payment` on port `4000`                     |
| Webhook returns `401`                          | `WEBHOOK_SECRET` must match between `apps/user-payloop/.env` and `apps/bank-webhook/.env` |
| Prisma client out of date                      | `npx prisma generate --schema=packages/db/prisma/schema.prisma`                           |

---

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♂️ Author

Built by [Czar16](https://x.com/itsCzar16) — follow along for more build-in-public updates.
