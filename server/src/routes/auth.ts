import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { get, run } from '../database.js';
import { generateToken, requirePatient, requireAdmin, AuthRequest } from '../middleware/auth.js';
import { sendVerificationCode, sendResetCode } from '../email.js';

const router = Router();

function generateCode(): string {
  return crypto.randomInt(100000, 999999).toString();
}

router.post('/register', async (req: AuthRequest, res: Response) => {
  const { firstName, lastName, email, phone, password } = req.body;

  if (!firstName || !lastName || !email || !phone || !password) {
    res.status(400).json({ error: 'Tous les champs sont requis' });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères' });
    return;
  }

  const existing = await get('SELECT id, email_verified FROM patients WHERE email = ?', email);
  if (existing) {
    if (existing.email_verified) {
      res.status(409).json({ error: 'Un compte avec cet email existe déjà' });
      return;
    }
    const code = generateCode();
    await run('UPDATE patients SET first_name=?, last_name=?, phone=?, password_hash=?, verification_code=? WHERE email=?',
      firstName, lastName, phone, await bcrypt.hash(password, 12), code, email);
    await sendVerificationCode(email, code);
    res.json({ message: 'Code de vérification envoyé', email });
    return;
  }

  const code = generateCode();
  const hash = await bcrypt.hash(password, 12);
  const result = await run(
    "INSERT INTO patients (first_name, last_name, email, phone, password_hash, verification_code) VALUES (?, ?, ?, ?, ?, ?) RETURNING id",
    firstName, lastName, email, phone, hash, code
  );

  await sendVerificationCode(email, code);

  res.status(201).json({ message: 'Code de vérification envoyé', email });
});

router.post('/verify-email', async (req: AuthRequest, res: Response) => {
  const { email, code } = req.body;

  if (!email || !code) {
    res.status(400).json({ error: 'Email et code requis' });
    return;
  }

  const patient: any = await get('SELECT * FROM patients WHERE email = ?', email);
  if (!patient) {
    res.status(404).json({ error: 'Patient non trouvé' });
    return;
  }
  if (patient.email_verified) {
    const token = generateToken({ id: patient.id, type: 'patient' });
    res.json({ message: 'Email déjà vérifié', token, patient: { id: patient.id, firstName: patient.first_name, lastName: patient.last_name, email: patient.email, phone: patient.phone } });
    return;
  }
  if (patient.verification_code !== code) {
    res.status(400).json({ error: 'Code de vérification incorrect' });
    return;
  }

  await run('UPDATE patients SET email_verified = TRUE, verification_code = NULL WHERE id = ?', patient.id);

  const token = generateToken({ id: patient.id, type: 'patient' });
  res.json({
    token,
    patient: {
      id: patient.id,
      firstName: patient.first_name,
      lastName: patient.last_name,
      email: patient.email,
      phone: patient.phone,
    },
  });
});

router.post('/resend-code', async (req: AuthRequest, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email requis' });
    return;
  }

  const patient: any = await get('SELECT * FROM patients WHERE email = ?', email);
  if (!patient) {
    res.status(404).json({ error: 'Patient non trouvé' });
    return;
  }
  if (patient.email_verified) {
    res.json({ message: 'Email déjà vérifié' });
    return;
  }

  const code = generateCode();
  await run('UPDATE patients SET verification_code = ? WHERE id = ?', code, patient.id);
  await sendVerificationCode(email, code);
  res.json({ message: 'Code de vérification renvoyé' });
});

router.post('/forgot-password', async (req: AuthRequest, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email requis' });
    return;
  }

  const patient: any = await get('SELECT * FROM patients WHERE email = ?', email);
  if (!patient) {
    res.json({ message: 'Si cet email existe, un code de réinitialisation a été envoyé' });
    return;
  }

  const code = generateCode();
  await run('UPDATE patients SET reset_code = ?, reset_code_expires = NOW() + INTERVAL \'15 minutes\' WHERE id = ?', code, patient.id);
  await sendResetCode(email, code);

  res.json({ message: 'Si cet email existe, un code de réinitialisation a été envoyé' });
});

router.post('/reset-password', async (req: AuthRequest, res: Response) => {
  const { email, code, password } = req.body;

  if (!email || !code || !password) {
    res.status(400).json({ error: 'Email, code et nouveau mot de passe requis' });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères' });
    return;
  }

  const patient: any = await get('SELECT * FROM patients WHERE email = ?', email);
  if (!patient) {
    res.status(400).json({ error: 'Code de réinitialisation incorrect ou expiré' });
    return;
  }

  if (!patient.reset_code || patient.reset_code !== code) {
    res.status(400).json({ error: 'Code de réinitialisation incorrect ou expiré' });
    return;
  }

  if (patient.reset_code_expires && new Date(patient.reset_code_expires) < new Date()) {
    res.status(400).json({ error: 'Code de réinitialisation expiré' });
    return;
  }

  const hash = await bcrypt.hash(password, 12);
  await run('UPDATE patients SET password_hash = ?, reset_code = NULL, reset_code_expires = NULL WHERE id = ?', hash, patient.id);

  res.json({ message: 'Mot de passe réinitialisé avec succès' });
});

router.post('/login', async (req: AuthRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email et mot de passe requis' });
    return;
  }

  const patient: any = await get('SELECT * FROM patients WHERE email = ?', email);
  if (!patient) {
    res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    return;
  }

  if (!(await bcrypt.compare(password, patient.password_hash))) {
    res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    return;
  }

  if (!patient.email_verified) {
    res.status(403).json({ error: 'Veuillez vérifier votre email avant de vous connecter', code: 'EMAIL_NOT_VERIFIED', email: patient.email });
    return;
  }

  const token = generateToken({ id: patient.id, type: 'patient' });

  res.json({
    token,
    patient: {
      id: patient.id,
      firstName: patient.first_name,
      lastName: patient.last_name,
      email: patient.email,
      phone: patient.phone,
    },
  });
});

router.post('/admin/login', async (req: AuthRequest, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: 'Identifiants requis' });
    return;
  }

  const admin: any = await get('SELECT * FROM admin_users WHERE username = ?', username);
  if (!admin) {
    res.status(401).json({ error: 'Identifiants incorrects' });
    return;
  }

  if (!(await bcrypt.compare(password, admin.password_hash))) {
    res.status(401).json({ error: 'Identifiants incorrects' });
    return;
  }

  const token = generateToken({ id: admin.id, type: 'admin' });

  res.json({
    token,
    admin: {
      id: admin.id,
      username: admin.username,
      displayName: admin.display_name,
    },
  });
});

router.get('/me', requirePatient, async (req: AuthRequest, res: Response) => {
  const patient: any = await get('SELECT id, first_name, last_name, email, phone, created_at FROM patients WHERE id = ?', req.userId);
  if (!patient) {
    res.status(404).json({ error: 'Patient non trouvé' });
    return;
  }
  res.json({
    id: patient.id,
    firstName: patient.first_name,
    lastName: patient.last_name,
    email: patient.email,
    phone: patient.phone,
    createdAt: patient.created_at,
  });
});

router.put('/password', requirePatient, async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Mot de passe actuel et nouveau mot de passe requis' });
    return;
  }
  if (newPassword.length < 8) {
    res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' });
    return;
  }
  const patient: any = await get('SELECT * FROM patients WHERE id = ?', req.userId);
  if (!patient || !(await bcrypt.compare(currentPassword, patient.password_hash))) {
    res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    return;
  }
  const hash = await bcrypt.hash(newPassword, 12);
  await run('UPDATE patients SET password_hash = ? WHERE id = ?', hash, req.userId);
  res.json({ success: true });
});

router.put('/admin/password', requireAdmin, async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Mot de passe actuel et nouveau mot de passe requis' });
    return;
  }
  if (newPassword.length < 8) {
    res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' });
    return;
  }
  const admin: any = await get('SELECT * FROM admin_users WHERE id = ?', req.userId);
  if (!admin || !(await bcrypt.compare(currentPassword, admin.password_hash))) {
    res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    return;
  }
  const hash = await bcrypt.hash(newPassword, 12);
  await run('UPDATE admin_users SET password_hash = ? WHERE id = ?', hash, req.userId);
  res.json({ success: true });
});

export default router;
