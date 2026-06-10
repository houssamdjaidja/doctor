import nodemailer from 'nodemailer';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const RESEND_FROM = process.env.RESEND_FROM || 'onboarding@resend.dev';
const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM = process.env.SMTP_FROM || 'noreply@dr-djaidja.dz';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

async function sendViaResend(to: string, subject: string, text: string): Promise<boolean> {
  if (!RESEND_API_KEY) return false;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: RESEND_FROM, to, subject, text }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error('[EMAIL] Resend API error:', res.status, body);
      return false;
    }
    return true;
  } catch (err: any) {
    console.error('[EMAIL] Resend HTTP error:', err?.message);
    return false;
  }
}

async function sendViaSMTP(to: string, subject: string, text: string): Promise<boolean> {
  const t = getTransporter();
  if (!t) return false;
  try {
    await t.sendMail({ from: SMTP_FROM, to, subject, text });
    return true;
  } catch (err: any) {
    console.error('[EMAIL] SMTP error:', err?.message);
    return false;
  }
}

async function sendEmail(to: string, subject: string, text: string): Promise<boolean> {
  if (await sendViaResend(to, subject, text)) return true;
  if (await sendViaSMTP(to, subject, text)) return true;
  console.log(`[EMAIL] ${subject} pour ${to}: ${text.match(/\d{6}/)?.[0] || '(code non trouvé)'}`);
  return false;
}

export async function sendVerificationCode(email: string, code: string): Promise<boolean> {
  return sendEmail(email, 'Vérification de votre email - Dr. Djaidja',
    `Bonjour,\n\nVotre code de vérification est : ${code}\n\nCe code expire dans 15 minutes.\n\nCordialement,\nDr. Djaidja`);
}

export async function sendResetCode(email: string, code: string): Promise<boolean> {
  return sendEmail(email, 'Réinitialisation de mot de passe - Dr. Djaidja',
    `Bonjour,\n\nVotre code de réinitialisation de mot de passe est : ${code}\n\nCe code expire dans 15 minutes.\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.\n\nCordialement,\nDr. Djaidja`);
}
