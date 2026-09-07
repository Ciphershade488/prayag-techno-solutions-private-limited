# Prayag Techno Solutions — Production & Render Deployment Guide

Official full-stack web application for **PRAYAG TECHNO SOLUTIONS PRIVATE LIMITED** built with Node.js, Express, React 19, TypeScript, Tailwind CSS, and hosted PostgreSQL database storage (e.g. Neon).

---

## 1. Project Architecture

- **Frontend**: React 19 + TypeScript + Tailwind CSS (Vite build)
- **Backend**: Express.js REST API with server-side routing
- **Database**: Relational PostgreSQL via `pg` connection pool with SSL support
  - Designed for Render's **$0 Free Web Service plan** paired with hosted PostgreSQL (such as **Neon**, **Supabase**, or Render PostgreSQL).
  - **No Persistent Disk needed**: Zero disk requirements and zero filesystem persistence.
  - Automatic database schema initialization and seeding upon first startup.
- **Authentication**: Secure JWT sessions with `bcryptjs` password hashing and protected admin middleware
- **Static Serving**: In production, the bundled Node server serves compiled client assets from `dist/` with client-side SPA fallback.

---

## 2. Environment Variables Configuration

Configure the following environment variables in your deployment environment (e.g., Render Dashboard > Environment Variables):

| Variable | Description | Recommended Production Value |
|----------|-------------|------------------------------|
| `PORT` | Web service port (Render automatically sets this or defaults to 3000) | `3000` |
| `NODE_ENV` | Environment mode | `production` |
| `DATABASE_URL` | PostgreSQL connection string (Neon / Render Postgres) | `postgres://user:pass@ep-xyz.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | Secret key for signing admin JWT sessions | Strong random 64-char string |
| `ADMIN_EMAIL` | Default email for first administrator account | `admin@prayagtechno.com` |
| `ADMIN_USERNAME` | Default username for first administrator | `admin` |
| `ADMIN_PASSWORD` | Default secure password for initial administrator | Strong custom password |
| `APP_URL` | Canonical public URL of the website | `https://prayagtechno.com` |

---

## 3. Render $0 Free Web Service Deployment

### Step 1: Set Up Free Hosted PostgreSQL (e.g., Neon)
1. Sign up for a free PostgreSQL database on [Neon.tech](https://neon.tech) (or Render / Supabase).
2. Create a project and copy the connection string URL (`postgres://...`).

### Step 2: Create a Web Service on Render
1. Connect your Git repository to **Render** (https://render.com).
2. Click **New +** > **Web Service**.
3. Select your repository.
4. Choose the **Free** instance type.

### Step 3: Configure Service Settings
- **Name**: `prayag-techno-solutions`
- **Region**: Choose the closest region (e.g., Singapore / Frankfurt / Oregon).
- **Branch**: `main` (or your production branch)
- **Runtime**: `Node`
- **Build Command**:
  ```bash
  npm install && npm run build
  ```
- **Start Command**:
  ```bash
  npm start
  ```

### Step 4: Configure Environment Variables
Under the **Environment** tab, add:
- `NODE_ENV` = `production`
- `PORT` = `3000`
- `DATABASE_URL` = `postgres://...` (your Neon/hosted PostgreSQL URL)
- `JWT_SECRET` = (Generate a secure secret key, e.g. using `openssl rand -hex 32`)
- `ADMIN_EMAIL` = `admin@prayagtechno.com`
- `ADMIN_PASSWORD` = (Set your production password)
- `ADMIN_USERNAME` = `admin`

---

## 4. Admin Management

- **Admin Login URL**: `/admin/login`
- **Admin Dashboard**: `/admin/dashboard`
- **Capabilities**:
  - Add, edit, close, and delete job openings in real time.
  - Review candidate job applications with contact info, experience, and cover letters.
  - Manage online client consultation bookings.
  - Update corporate profile (addresses, phone numbers, email, business hours, and social media).

---

## 5. Local Development Commands

- `npm install` — Install all dependencies
- `npm run dev` — Run development server with live reload
- `npm run build` — Build production frontend and compile backend bundle to `dist/server.cjs`
- `npm start` — Run production server
- `node scripts/create-admin.js <email> <password> [username]` — Create or reset administrator password via CLI
- `npm run migrate-data` — Transfer existing SQLite data to your PostgreSQL `DATABASE_URL`
