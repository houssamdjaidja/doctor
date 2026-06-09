import { Router, Request, Response } from 'express';
import { get, all, run } from '../database.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

router.get('/', async (req: Request, res: Response) => {
  const { category, search, featured, published } = req.query;
  let sql = 'SELECT * FROM blog_posts WHERE 1=1';
  const params: any[] = [];

  if (published !== 'false') {
    sql += ' AND published = TRUE';
  }
  if (category && category !== 'all') {
    sql += ' AND category = ?';
    params.push(category);
  }
  if (featured === 'true') {
    sql += ' AND featured = TRUE';
  }
  if (search) {
    sql += ' AND (title ILIKE ? OR excerpt ILIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += ' ORDER BY created_at DESC';

  const posts = (await all(sql, ...params)).map((p: any) => ({
    ...p,
    content: undefined,
  }));
  res.json(posts);
});

router.get('/admin', requireAdmin, async (req: Request, res: Response) => {
  const posts = await all('SELECT * FROM blog_posts ORDER BY created_at DESC');
  res.json(posts);
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const isId = /^\d+$/.test(id);
  let post: any;
  if (isId) {
    post = await get('SELECT * FROM blog_posts WHERE id = ?', id);
  } else {
    post = await get('SELECT * FROM blog_posts WHERE slug = ?', id);
  }

  if (!post) {
    res.status(404).json({ error: 'Article non trouvé' });
    return;
  }

  await run('UPDATE blog_posts SET views = views + 1 WHERE id = ?', post.id);

  res.json(post);
});

router.post('/', requireAdmin, async (req: Request, res: Response) => {
  const { title, excerpt, content, category, imageUrl, author, published, featured } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Le titre est requis' });
    return;
  }

  const slug = slugify(title);
  const result = await run(
    `INSERT INTO blog_posts (title, slug, excerpt, content, category, image_url, author, published, featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
    title, slug, excerpt || '', content || '', category || 'general',
    imageUrl || '', author || 'Dr. Amine Benali',
    published ? true : false, featured ? true : false
  );

  res.status(201).json(result.rows[0]);
});

router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
  const existing: any = await get('SELECT * FROM blog_posts WHERE id = ?', req.params.id);
  if (!existing) {
    res.status(404).json({ error: 'Article non trouvé' });
    return;
  }

  const { title, excerpt, content, category, imageUrl, author, published, featured } = req.body;

  await run(`
    UPDATE blog_posts SET
      title = COALESCE(?, title),
      slug = CASE WHEN ? IS NOT NULL THEN ? ELSE slug END,
      excerpt = COALESCE(?, excerpt),
      content = COALESCE(?, content),
      category = COALESCE(?, category),
      image_url = COALESCE(?, image_url),
      author = COALESCE(?, author),
      published = COALESCE(?, published),
      featured = COALESCE(?, featured),
      updated_at = NOW()
    WHERE id = ?
  `,
    title || null,
    title ? slugify(title) : null, title ? slugify(title) : null,
    excerpt || null, content || null, category || null,
    imageUrl || null, author || null,
    published !== undefined ? (published ? true : false) : null,
    featured !== undefined ? (featured ? true : false) : null,
    req.params.id
  );

  const updated = await get('SELECT * FROM blog_posts WHERE id = ?', req.params.id);
  res.json(updated);
});

router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  const result = await run('DELETE FROM blog_posts WHERE id = ? RETURNING id', req.params.id);
  if (result.rowCount === 0) {
    res.status(404).json({ error: 'Article non trouvé' });
    return;
  }
  res.json({ success: true });
});

export default router;
