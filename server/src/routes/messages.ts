import { Router, Response } from 'express';
import { get, all, run } from '../database.js';
import { requirePatient, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', requirePatient, async (req: AuthRequest, res: Response) => {
  const messages = await all(
    'SELECT * FROM patient_messages WHERE patient_id = ? ORDER BY created_at DESC',
    req.userId
  );
  res.json(messages);
});

router.get('/all', requireAdmin, async (req: AuthRequest, res: Response) => {
  const messages = await all(
    `SELECT m.*, p.first_name, p.last_name, p.email as patient_email
     FROM patient_messages m LEFT JOIN patients p ON m.patient_id = p.id
     ORDER BY m.created_at DESC`
  );
  res.json(messages);
});

router.post('/', requirePatient, async (req: AuthRequest, res: Response) => {
  const { subject, message } = req.body;
  if (!subject || !message) {
    res.status(400).json({ error: 'Sujet et message requis' });
    return;
  }
  const result = await run(
    'INSERT INTO patient_messages (patient_id, subject, message) VALUES (?, ?, ?) RETURNING *',
    req.userId, subject, message
  );
  res.status(201).json(result.rows[0]);
});

router.put('/:id/reply', requireAdmin, async (req: AuthRequest, res: Response) => {
  const { reply } = req.body;
  const existing = await get('SELECT * FROM patient_messages WHERE id = ?', req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'Message non trouvأ©' });
    return;
  }
  await run(
    "UPDATE patient_messages SET reply = ?, reply_at = NOW(), read_by_patient = FALSE, read_by_admin = TRUE WHERE id = ?",
    reply, req.params.id
  );
  const updated = await get('SELECT * FROM patient_messages WHERE id = ?', req.params.id);
  res.json(updated);
});

router.put('/:id/read', requirePatient, async (req: AuthRequest, res: Response) => {
  const existing: any = await get('SELECT * FROM patient_messages WHERE id = ?', req.params.id);
  if (!existing || existing.patient_id !== req.userId) {
    res.status(404).json({ error: 'Message non trouvأ©' });
    return;
  }
  await run('UPDATE patient_messages SET read_by_patient = TRUE WHERE id = ?', req.params.id);
  res.json({ success: true });
});

export default router;
