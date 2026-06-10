import { Router, Response } from 'express';
import { get, all, run } from '../database.js';
import { requirePatient, requireAdmin, optionalAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  const { date, status, patient_id } = req.query;
  let sql = 'SELECT * FROM appointments WHERE 1=1';
  const params: any[] = [];

  if (req.userType === 'patient') {
    sql += ' AND patient_id = ?';
    params.push(req.userId);
  } else if (req.userType === 'admin') {
    if (patient_id) {
      sql += ' AND patient_id = ?';
      params.push(patient_id);
    }
  } else {
    sql += ' AND 1=0';
  }

  if (date) {
    sql += ' AND date = ?';
    params.push(date as string);
  }
  if (status) {
    sql += ' AND status = ?';
    params.push(status as string);
  }

  sql += ' ORDER BY date DESC, time_slot DESC';

  const appointments = await all(sql, ...params);
  res.json(appointments);
});

const TIME_SLOTS = [
  "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
];

router.get('/available', async (req: AuthRequest, res: Response) => {
  const { date } = req.query;
  if (!date) {
    res.status(400).json({ error: 'Date requise' });
    return;
  }

  const booked = await all(
    "SELECT time_slot FROM appointments WHERE date = ? AND status != 'cancelled'",
    date as string
  );

  const bookedSlots = new Set(booked.map((b: any) => b.time_slot));
  const available = TIME_SLOTS.filter(slot => !bookedSlots.has(slot));

  res.json({ date, available });
});

router.get('/public', async (req: AuthRequest, res: Response) => {
  const { date, status } = req.query;
  let sql = 'SELECT id, date, time_slot, motif, status FROM appointments WHERE 1=1';
  const params: any[] = [];

  if (date) {
    sql += ' AND date = ?';
    params.push(date as string);
  }
  if (status) {
    sql += ' AND status = ?';
    params.push(status as string);
  }

  sql += ' ORDER BY date, time_slot';
  const appointments = await all(sql, ...params);
  res.json(appointments);
});

router.get('/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  const appointment: any = await get('SELECT * FROM appointments WHERE id = ?', req.params.id);
  if (!appointment) {
    res.status(404).json({ error: 'Rendez-vous non trouvé' });
    return;
  }

  if (req.userType === 'patient' && appointment.patient_id !== req.userId) {
    res.status(403).json({ error: 'Accès refusé' });
    return;
  }

  res.json(appointment);
});

router.post('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  const { firstName, lastName, phone, email, date, timeSlot, motif, notes, patientId } = req.body;

  if (!firstName || !lastName || !phone || !date || !timeSlot) {
    res.status(400).json({ error: 'Champs requis manquants' });
    return;
  }

  const existing = await get(
    "SELECT id FROM appointments WHERE date = ? AND time_slot = ? AND status != 'cancelled'",
    date, timeSlot
  );
  if (existing) {
    res.status(409).json({ error: 'Ce créneau est déjà réservé' });
    return;
  }

  const effectivePatientId = req.userType === 'patient' ? req.userId : (patientId || null);

  const result = await run(
    `INSERT INTO appointments (patient_id, first_name, last_name, phone, email, date, time_slot, motif, notes, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending') RETURNING *`,
    effectivePatientId, firstName, lastName, phone, email || '', date, timeSlot, motif || '', notes || ''
  );

  res.status(201).json(result.rows[0]);
});

router.put('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  const { status, date, timeSlot, motif, notes } = req.body;

  const existing = await get('SELECT * FROM appointments WHERE id = ?', req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'Rendez-vous non trouvé' });
    return;
  }

  await run(`
    UPDATE appointments SET
      status = COALESCE(?, status),
      date = COALESCE(?, date),
      time_slot = COALESCE(?, time_slot),
      motif = COALESCE(?, motif),
      notes = COALESCE(?, notes)
    WHERE id = ?
  `, status || null, date || null, timeSlot || null, motif || null, notes || null, req.params.id);

  const updated = await get('SELECT * FROM appointments WHERE id = ?', req.params.id);
  res.json(updated);
});

router.delete('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  const result = await run('DELETE FROM appointments WHERE id = ? RETURNING id', req.params.id);
  if (result.rowCount === 0) {
    res.status(404).json({ error: 'Rendez-vous non trouvé' });
    return;
  }
  res.json({ success: true });
});

router.patch('/:id/cancel', requirePatient, async (req: AuthRequest, res: Response) => {
  const appointment: any = await get('SELECT * FROM appointments WHERE id = ?', req.params.id);
  if (!appointment) {
    res.status(404).json({ error: 'Rendez-vous non trouvé' });
    return;
  }
  if (appointment.patient_id !== req.userId) {
    res.status(403).json({ error: 'Vous ne pouvez annuler que vos propres rendez-vous' });
    return;
  }
  await run("UPDATE appointments SET status = 'cancelled' WHERE id = ?", req.params.id);
  const updated = await get('SELECT * FROM appointments WHERE id = ?', req.params.id);
  res.json(updated);
});

export default router;
