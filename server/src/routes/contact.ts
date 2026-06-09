import { Router, Request, Response } from 'express';
import { get, all, run } from '../database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Nom, email et message sont requis' });
    return;
  }

  const result = await run(
    'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?) RETURNING id',
    name, email, phone || '', subject || '', message
  );

  res.status(201).json({ success: true, id: result.rows[0].id });
});

router.get('/', requireAdmin, async (req: Request, res: Response) => {
  const { read } = req.query;
  let sql = 'SELECT * FROM contact_messages WHERE 1=1';
  const params: any[] = [];

  if (read !== undefined) {
    sql += ' AND read = ?';
    params.push(read === 'true' ? true : false);
  }

  sql += ' ORDER BY created_at DESC';
  const messages = await all(sql, ...params);
  res.json(messages);
});

router.put('/:id/read', requireAdmin, async (req: Request, res: Response) => {
  const existing = await get('SELECT * FROM contact_messages WHERE id = ?', req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'Message non trouvé' });
    return;
  }

  await run('UPDATE contact_messages SET read = TRUE WHERE id = ?', req.params.id);
  res.json({ success: true });
});

router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  const result = await run('DELETE FROM contact_messages WHERE id = ? RETURNING id', req.params.id);
  if (result.rowCount === 0) {
    res.status(404).json({ error: 'Message non trouvé' });
    return;
  }
  res.json({ success: true });
});

export default router;
