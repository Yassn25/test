# All-in-one Marketing MVP

Omnichannel marketing control center that unifies SMS, WhatsApp, and Email workflows. The MVP ships with an Express + PostgreSQL backend, a modern Vite + React frontend, and ready-to-use APIs for managing authentication, contacts, and multichannel campaigns.

## Features
- JWT-authenticated onboarding flow (register, login, me)
- Contact management with tagging support
- Campaign orchestration across SMS, WhatsApp, and Email channels
- React dashboard with campaign insights and CRUD screens
- Configurable Postgres connection and third-party provider placeholders

## Tech Stack
- **Backend:** Node.js (Express), PostgreSQL (`pg`), JWT, Joi validation
- **Frontend:** React 18 with Vite, React Router 6, Axios
- **Tooling:** npm workspaces, dotenv, nodemon

## Project Structure
```
project-root/
├── backend/          # Express API
├── frontend/         # Vite + React SPA
├── .env.example      # Sample environment configuration
├── package.json      # Root scripts & workspace config
└── README.md
```

## Getting Started

### 1. Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm (comes with Node)

### 2. Install dependencies
```bash
npm install               # runs install for both backend and frontend workspaces
```

### 3. Environment configuration
1. Copy `.env.example` to `.env` and update the values (database URL, JWT secret, provider credentials, etc.).
2. Optional: create dedicated `.env` files inside `backend` or `frontend` if you prefer per-package config.

### 4. Database schema
The backend expects the following tables. Run this SQL against your Postgres instance:
```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email CITEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('sms', 'email', 'whatsapp')),
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  template_id TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Run the apps
Terminal 1 – start the API:
```bash
npm run dev:backend
```

Terminal 2 – launch the React SPA:
```bash
npm run dev:frontend
```

The API listens on `http://localhost:5000` (configurable via `PORT`). The frontend runs on `http://localhost:5173` and proxies `/api` requests to the backend.

## API Overview

Base URL: `/api`

- `POST /auth/register` – create account (returns JWT + profile)
- `POST /auth/login` – authenticate user
- `GET /auth/me` – fetch current profile
- `GET /contacts` – list contacts (auth required)
- `POST /contacts` – create contact
- `PUT /contacts/:id` – update contact
- `DELETE /contacts/:id` – remove contact
- `GET /campaigns` – list campaigns
- `POST /campaigns` – create campaign
- `GET /campaigns/:id` – campaign detail
- `PATCH /campaigns/:id/status` – update campaign status

All protected routes expect `Authorization: Bearer <token>` headers.

## Frontend Highlights
- Auth-aware routing with protected dashboard (`/`, `/contacts`, `/campaigns`)
- Reusable Axios client (`src/services/apiClient.js`) automatically injects JWT
- Form-driven UX for contacts and campaigns, including status management

## Next Steps
- Wire SMS/WhatsApp delivery to real providers (Twilio / WhatsApp Cloud API)
- Add campaign analytics & delivery tracking
- Integrate background workers for scheduled sends
- Expand validation and error reporting

---
Happy building! 🎯
