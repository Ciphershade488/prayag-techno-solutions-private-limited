import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import { initDatabase } from './server/db';
import authRoutes from './server/routes/auth';
import jobsRoutes from './server/routes/jobs';
import companyRoutes from './server/routes/company';
import statsRoutes from './server/routes/stats';
import bookingsRoutes from './server/routes/bookings';
import applicationsRoutes from './server/routes/applications';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize PostgreSQL database, create tables, and seed defaults
  await initDatabase();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // API Routes
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api', jobsRoutes);
  app.use('/api', companyRoutes);
  app.use('/api', statsRoutes);
  app.use('/api', bookingsRoutes);
  app.use('/api', applicationsRoutes);

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Prayag Techno Solutions server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
