# Petro Engineering — Standalone Node.js / Express Backend

This standalone Node.js backend server provides all REST API endpoints for Petro Engineering. It is designed to work with **Lovable**, Vite/React frontends, mobile apps, and external consumers, completely independent of Next.js server runtime.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Ensure your `.env.local` or `.env` contains:
```env
DATABASE_URL="postgresql://postgres.[REF]:[PASS]@[HOST]:6543/postgres"
SESSION_SECRET="petronex_secure_admin_session_key_2026_super_secret"
PORT=5000

# Optional SMTP
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@petroeng.in"
SMTP_PASS="your-password"
SMTP_FROM="Petro Engineering <procurement@petroeng.in>"
```

### 3. Start the Server
```bash
# Production mode
npm run server

# Development auto-reloading
npm run server:dev
```
The server starts at **`http://localhost:5000`**.

---

## 🌐 Connecting from Lovable

In your Lovable frontend or `.env` file, point API requests to your Node.js backend URL:
```env
VITE_API_URL=http://localhost:5000
```
or in code:
```ts
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const res = await fetch(`${API_BASE}/api/admin/stats`, {
  credentials: "include", // sends cookies
  headers: {
    "Authorization": `Bearer ${token}` // or Bearer auth
  }
});
```

### CORS is Pre-Configured For:
- `http://localhost:5173` (Vite)
- `http://localhost:3000` (Next.js)
- `http://localhost:8080`
- `*.lovable.app`
- `*.lovableproject.com`
- Wildcard permissive in development

---

## 📡 API Endpoints Reference

### Public Endpoints:
- `GET  /health` — Server health check
- `GET  /api/db-check` — PostgreSQL database connection verification
- `POST /api/contact` — Customer inquiry submission (mirrors to RFQ if instrument-related)
- `POST /api/rfq` — Request for quotation submission
- `GET  /api/careers/jobs` — Published job listings
- `GET  /api/careers/jobs/:slug` — Single job details
- `POST /api/careers/applications/submit` — Candidate job application with CV upload

### Authentication:
- `POST /api/auth/login` — Admin login (returns `{ success, token, user }` + sets HTTP cookie)
- `POST /api/auth/logout` — Clears admin session
- `GET  /api/auth/me` — Current authenticated admin profile

### Admin Operations (Requires Cookie or `Authorization: Bearer <token>`):
- `GET  /api/admin/stats` — Real-time analytics, pipeline status & counters
- `GET, POST, PUT, DELETE /api/admin/products` — Product catalogue management
- `GET, POST, PUT, DELETE /api/admin/categories` — Product categories management
- `GET, PATCH, DELETE /api/admin/quote-requests` — Quotation requests management
- `GET, PATCH, DELETE /api/admin/enquiries` — Customer inquiries management
- `GET, POST, PUT, DELETE /api/admin/careers/jobs` — Job vacancy listings
- `GET, PUT /api/admin/careers/applications` — Candidate applications & resume downloads
- `GET, POST, PUT, DELETE /api/admin/documents` — Brochures & technical data sheets
- `GET, POST, PUT, DELETE /api/admin/services` — Engineering services
- `GET, POST, PUT, DELETE /api/admin/industries` — Industry solutions
- `POST /api/admin/upload-image` — Direct image upload
- `GET, POST, PATCH, DELETE /api/admin/users` — Admin users (Super Admin only)
- `GET  /api/admin/audit-logs` — Security audit logs (Super Admin only)

---

## 🚢 Deployment

You can deploy this Node.js server to any platform with a single command:
- **Render / Railway / Fly.io / Heroku**: Set build command `npm install` and start command `node server/index.js`.
- **AWS / VPS**: Run using PM2: `pm2 start server/index.js --name petro-backend`.
