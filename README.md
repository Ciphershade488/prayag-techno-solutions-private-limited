# PRAYAG TECHNO SOLUTIONS PRIVATE LIMITED

Official corporate web portal and management application for **Prayag Techno Solutions Private Limited** — provider of IT Services, HR Services, BPO Solutions, and GeM Consultancy across India since 2017.

## Key Features

- **Public Website**:
  - Company Overview, Mission, and Core Competencies
  - Detailed Services breakdown (IT Hardware & AMC, HR & Payroll Outsourcing, BPO & Data Processing, GeM Tender & Vendor Consultancy)
  - Online Client Consultation Booking system
  - Live Careers Portal with open job openings and candidate application submission
  - Corporate Office and Branch Location directory

- **Administrative Management Suite**:
  - Secure Administrator Authentication (`/admin/login`) with encrypted JWT sessions
  - Real-time Career Openings CRUD (Add, Edit, Close, Delete)
  - Candidate Job Applications review
  - Client Consultation Bookings management and status tracking
  - Live Corporate Profile & Contact Info editing

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend**: Node.js, Express.js
- **Database**: Relational PostgreSQL via `pg` connection pool with SSL (compatible with Neon, Render PostgreSQL, Supabase, etc.)
- **Security**: `bcryptjs` password hashing, JSON Web Tokens (JWT), httpOnly cookies

## Deployment

Refer to `DEPLOYMENT.md` for detailed instructions on deploying to Render's Free Web Service with a hosted PostgreSQL database (e.g., Neon).

```bash
# Build
npm install && npm run build

# Start
npm start
```
