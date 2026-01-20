import { Router } from 'express';
import { z } from 'zod';
import { addInquiry, listInquiries } from '../storage';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email(),
  type: z.string().min(2).max(100),
  message: z.string().min(10).max(5000)
});

router.post('/', (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: 'Invalid input',
      details: parsed.error.flatten()
    });
  }
  const { name, email, type, message } = parsed.data;
  const saved = addInquiry({ name, email, type, message });
  return res.status(201).json({ ok: true, id: saved.id });
});

router.get('/', (_req, res) => {
  const rows = listInquiries();
  return res.json({ ok: true, data: rows });
});

export default router;