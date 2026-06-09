import { Router, Request, Response } from 'express';
import { get, all, run } from '../database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const rows: any[] = await all('SELECT key, value FROM settings');
  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  res.json(settings);
});

router.put('/', requireAdmin, async (req: Request, res: Response) => {
  const updates = req.body;

  for (const [key, value] of Object.entries(updates)) {
    const result = await run('UPDATE settings SET value = ? WHERE key = ?', value as string, key);
    if (result.rowCount === 0) {
      await run('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT (key) DO NOTHING', key, value as string);
    }
  }

  const rows: any[] = await all('SELECT key, value FROM settings');
  const settings: Record<string, string> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  res.json(settings);
});

export default router;
