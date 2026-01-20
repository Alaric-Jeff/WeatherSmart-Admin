import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { initStorage } from './storage';
import { initializeFirebase } from './firebase';
import contactRouter from './routes/contact';
import authRouter from './routes/auth';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);
const corsOrigin = process.env.CORS_ORIGIN || '*';

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

// Initialize storage and Firebase
initStorage();
initializeFirebase();

// Health
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, status: 'healthy' });
});

// Contact/Inquiries
app.use('/api/contact', contactRouter);

// Auth (demo)
app.use('/api/auth', authRouter);

// Static manuals (optional): serve PDFs from ./public/manuals
const manualsDir = path.resolve(process.cwd(), 'public', 'manuals');
app.use('/public/manuals', express.static(manualsDir));

app.listen(port, () => {
  console.log(`[backend-website] listening on http://localhost:${port}`);
});
