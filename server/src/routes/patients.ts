import { Router, Response } from 'express';
import { get, all, run } from '../database.js';
import { requirePatient, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAdmin, async (_req: AuthRequest, res: Response) => {
  const patients = await all('SELECT id, first_name, last_name, email, phone, created_at, updated_at FROM patients ORDER BY created_at DESC');
  res.json(patients);
});

router.get('/me', requirePatient, async (req: AuthRequest, res: Response) => {
  const patient = await get('SELECT id, first_name, last_name, email, phone, created_at, updated_at FROM patients WHERE id = ?', req.userId);
  if (!patient) {
    res.status(404).json({ error: 'Patient non trouvأ©' });
    return;
  }
  res.json(patient);
});

router.get('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  const patient = await get('SELECT id, first_name, last_name, email, phone, created_at, updated_at FROM patients WHERE id = ?', req.params.id);
  if (!patient) {
    res.status(404).json({ error: 'Patient non trouvأ©' });
    return;
  }
  res.json(patient);
});

router.put('/me', requirePatient, async (req: AuthRequest, res: Response) => {
  const { firstName, lastName, phone } = req.body;

  await run(`
    UPDATE patients SET
      first_name = COALESCE(?, first_name),
      last_name = COALESCE(?, last_name),
      phone = COALESCE(?, phone),
      updated_at = NOW()
    WHERE id = ?
  `, firstName || null, lastName || null, phone || null, req.userId);

  const updated = await get('SELECT id, first_name, last_name, email, phone, created_at, updated_at FROM patients WHERE id = ?', req.userId);
  res.json(updated);
});

router.put('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  const { firstName, lastName, email, phone } = req.body;

  const existing = await get('SELECT * FROM patients WHERE id = ?', req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'Patient non trouvأ©' });
    return;
  }

  await run(`
    UPDATE patients SET
      first_name = COALESCE(?, first_name),
      last_name = COALESCE(?, last_name),
      email = COALESCE(?, email),
      phone = COALESCE(?, phone),
      updated_at = NOW()
    WHERE id = ?
  `, firstName || null, lastName || null, email || null, phone || null, req.params.id);

  const updated = await get('SELECT id, first_name, last_name, email, phone, created_at, updated_at FROM patients WHERE id = ?', req.params.id);
  res.json(updated);
});

router.delete('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  const result = await run('DELETE FROM patients WHERE id = ? RETURNING id', req.params.id);
  if (result.rowCount === 0) {
    res.status(404).json({ error: 'Patient non trouvأ©' });
    return;
  }
  res.json({ success: true });
});

export default router;
