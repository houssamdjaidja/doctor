import { Router, Request, Response } from 'express';
import { get, all, run } from '../database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const categories: any[] = await all('SELECT * FROM faq_categories ORDER BY sort_order');
  const items: any[] = await all('SELECT * FROM faq_items ORDER BY sort_order');

  const result = categories.map(cat => ({
    category: cat.name === 'Rendez-vous' ? 'appointments' : cat.name === 'Pratique' ? 'practical' : 'payment',
    name: cat.name,
    icon: cat.icon,
    questions: items
      .filter(item => item.category_id === cat.id)
      .map(item => ({
        id: item.id,
        question: item.question,
        answer: item.answer,
      })),
  }));

  res.json(result);
});

router.post('/categories', requireAdmin, async (req: Request, res: Response) => {
  const { name, icon } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Le nom est requis' });
    return;
  }

  const maxOrder: any = await get('SELECT COALESCE(MAX(sort_order), 0) + 1 as next FROM faq_categories');
  const result = await run(
    'INSERT INTO faq_categories (name, icon, sort_order) VALUES (?, ?, ?) RETURNING id',
    name, icon || 'HelpCircle', maxOrder.next
  );
  res.status(201).json({ id: result.rows[0].id, name, icon: icon || 'HelpCircle' });
});

router.post('/', requireAdmin, async (req: Request, res: Response) => {
  const { categoryId, question, answer } = req.body;
  if (!categoryId || !question || !answer) {
    res.status(400).json({ error: 'Tous les champs sont requis' });
    return;
  }

  const maxOrder: any = await get('SELECT COALESCE(MAX(sort_order), 0) + 1 as next FROM faq_items WHERE category_id = ?', categoryId);
  const result = await run(
    'INSERT INTO faq_items (category_id, question, answer, sort_order) VALUES (?, ?, ?, ?) RETURNING id',
    categoryId, question, answer, maxOrder.next
  );
  res.status(201).json({ id: result.rows[0].id, categoryId, question, answer });
});

router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
  const { question, answer } = req.body;
  const existing = await get('SELECT * FROM faq_items WHERE id = ?', req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'Question non trouvأ©e' });
    return;
  }

  await run('UPDATE faq_items SET question = COALESCE(?, question), answer = COALESCE(?, answer) WHERE id = ?',
    question || null, answer || null, req.params.id);

  const updated = await get('SELECT * FROM faq_items WHERE id = ?', req.params.id);
  res.json(updated);
});

router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  const result = await run('DELETE FROM faq_items WHERE id = ? RETURNING id', req.params.id);
  if (result.rowCount === 0) {
    res.status(404).json({ error: 'Question non trouvأ©e' });
    return;
  }
  res.json({ success: true });
});

export default router;
