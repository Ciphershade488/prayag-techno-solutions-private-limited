# Prayag Techno Solutions — Deployment & Setup Guide

This project is a full-stack web application with React 19, TypeScript, Tailwind CSS, Express backend, and persistent relational SQLite database storage (`node:sqlite`).

---

## 1. Environment Variables (`.env`)

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Available variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | HTTP server port | `3000` |
| `JWT_SECRET` | Secret key for signing admin JWT sessions | Required in production |
| `ADMIN_EMAIL` | Default email for the first administrator account | `admin@prayagtechno.com` |
| `ADMIN_USERNAME` | Default username for the administrator | `admin` |
| `ADMIN_PASSWORD` | Default password for initial administrator | `Admin@Prayag2026!` |
| `DATABASE_PATH` | Path to the SQLite database file | `./data/prayag.db` |
| `GEMINI_API_KEY` | Optional API key for Google Gemini services | `""` |

---

## 2. Local Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The server starts at `http://localhost:3000`.

---

## 3. Creating & Managing Admin Accounts

### Automatic First-Run Seeding
When the server starts for the first time and no administrator exists in the database, it automatically creates an administrator using `ADMIN_EMAIL`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` from your environment variables.

### CLI Script (Create / Reset Admin)
You can create a new admin or reset an existing admin's password at any time via CLI:

```bash
node scripts/create-admin.js <email> <password> [username]
```

Example:
```bash
node scripts/create-admin.js admin@prayagtechno.com "Admin@Prayag2026!" admin
```

---

## 4. Production Build & Start

Build the client assets and compile the Express server into a standalone bundle:

```bash
npm run build
npm start
```

- `npm run build` runs `vite build` to output static client assets to `dist/`, then compiles `server.ts` with `esbuild` to `dist/server.cjs`.
- `npm start` executes `node dist/server.cjs` which serves both the API endpoints and the frontend on port `3000`.

---

## 5. Deployment Instructions

### Deploying to Render / Railway / Cloud Run / VPS
1. **Build Command**: `npm install && npm run build`
2. **Start Command**: `npm start`
3. **Persistent Disk (Optional but Recommended)**:
   - Mount a persistent disk to `/app/data` or configure `DATABASE_PATH=/var/data/prayag.db` so job listings and company updates persist across redeployments.
4. **Environment Variables**:
   - Set `JWT_SECRET` to a strong random string.
   - Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` to your chosen credentials.
5. **Accessing Admin Panel**:
   - Navigate to `/admin/login`.
   - Sign in using your configured admin credentials.
   - Access the dashboard at `/admin/dashboard` to manage jobs and company details.
