import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { initializeDatabase } from './database.js';
import { seedData } from './docker-init.js';

import authRoutes from './routes/auth.js';
import appointmentRoutes from './routes/appointments.js';
import blogRoutes from './routes/blog.js';
import contactRoutes from './routes/contact.js';
import faqRoutes from './routes/faq.js';
import patientRoutes from './routes/patients.js';
import settingsRoutes from './routes/settings.js';
import adminRoutes from './routes/admin.js';
import messageRoutes from './routes/messages.js';
import documentRoutes from './routes/documents.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CORS_ORIGIN || 'https://doctor-app.vercel.app'
    : true,
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Trop de tentatives, rأ©essayez dans 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/documents', documentRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Unhandled error:', err?.message || err);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

async function start() {
  for (let i = 1; i <= 10; i++) {
    try {
      await initializeDatabase();
      await seedData();
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
      return;
    } catch (err: any) {
      console.error(`Startup attempt ${i}/10 failed:`, err?.message);
      if (i === 10) process.exit(1);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

start();
