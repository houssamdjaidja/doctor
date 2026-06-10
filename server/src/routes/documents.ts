import { Router, Response } from 'express';
import { get, all, run } from '../database.js';
import { requirePatient, optionalAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  const { patient_id } = req.query;
  let sql = 'SELECT id, patient_id, name, file_type, file_size, created_at FROM patient_documents WHERE 1=1';
  const params: any[] = [];

  if (req.userType === 'patient') {
    sql += ' AND patient_id = ?';
    params.push(req.userId);
  } else if (req.userType === 'admin' && patient_id) {
    sql += ' AND patient_id = ?';
    params.push(patient_id);
  } else if (!req.userType) {
    sql += ' AND 1=0';
  }

  sql += ' ORDER BY created_at DESC';
  const docs = await all(sql, ...params);
  res.json(docs);
});

router.get('/:id/download', optionalAuth, async (req: AuthRequest, res: Response) => {
  if (!req.userType) {
    res.status(401).json({ error: 'Authentification requise' });
    return;
  }
  const doc: any = await get('SELECT * FROM patient_documents WHERE id = ?', req.params.id);
  if (!doc) {
    res.status(404).json({ error: 'Document non trouvé' });
    return;
  }
  if (req.userType === 'patient' && doc.patient_id !== req.userId) {
    res.status(403).json({ error: 'Accès refusé' });
    return;
  }
  res.json({
    id: doc.id,
    name: doc.name,
    file_type: doc.file_type,
    file_data: doc.file_data,
    file_size: doc.file_size,
  });
});

const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const BLOCKED_EXTENSIONS = ['.exe', '.bat', '.cmd', '.sh', '.bin', '.dll', '.msi', '.scr', '.pif', '.com', '.vbs', '.ps1'];

router.post('/', requirePatient, async (req: AuthRequest, res: Response) => {
  const { name, file_type, file_data } = req.body;
  if (!name || !file_data) {
    res.status(400).json({ error: 'Nom et fichier requis' });
    return;
  }

  const fileName = name.replace(/[^a-zA-Z0-9._\-\s]/g, '').trim();
  if (!fileName) {
    res.status(400).json({ error: 'Nom de fichier invalide' });
    return;
  }

  const ext = fileName.toLowerCase().slice(fileName.lastIndexOf('.'));
  if (BLOCKED_EXTENSIONS.includes(ext)) {
    res.status(400).json({ error: 'Ce type de fichier n\'est pas autorisé' });
    return;
  }

  const mime = file_type || 'application/octet-stream';
  if (!ALLOWED_MIME_TYPES.includes(mime)) {
    res.status(400).json({ error: 'Type de fichier non autorisé (PDF, images, DOC, XLS, TXT uniquement)' });
    return;
  }

  if (!/^[A-Za-z0-9+/=]+$/.test(file_data)) {
    res.status(400).json({ error: 'Fichier invalide' });
    return;
  }

  const fileSize = Math.ceil((file_data.length * 3) / 4);
  if (fileSize > MAX_FILE_SIZE) {
    res.status(400).json({ error: 'Fichier trop volumineux (max 10 Mo)' });
    return;
  }

  const result = await run(
    'INSERT INTO patient_documents (patient_id, name, file_type, file_data, file_size) VALUES (?, ?, ?, ?, ?) RETURNING id, patient_id, name, file_type, file_size, created_at',
    req.userId, fileName, mime, file_data, fileSize
  );
  res.status(201).json(result.rows[0]);
});

router.delete('/:id', requirePatient, async (req: AuthRequest, res: Response) => {
  const doc: any = await get('SELECT * FROM patient_documents WHERE id = ?', req.params.id);
  if (!doc) {
    res.status(404).json({ error: 'Document non trouvé' });
    return;
  }
  if (req.userType === 'patient' && doc.patient_id !== req.userId) {
    res.status(403).json({ error: 'Accès refusé' });
    return;
  }
  await run('DELETE FROM patient_documents WHERE id = ?', req.params.id);
  res.json({ success: true });
});

export default router;
