import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const FROM_ADDRESS = process.env.SMTP_FROM || 'noreply@dr-benali.dz';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }
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

export async function sendVerificationCode(email: string, code: string): Promise<void> {
  const t = getTransporter();
  const message = `Bonjour,\n\nVotre code de vérification est : ${code}\n\nCe code expire dans 15 minutes.\n\nCordialement,\nDr. Amine Benali`;

  if (t) {
    try {
      await t.sendMail({
        from: FROM_ADDRESS,
        to: email,
        subject: 'Vérification de votre email - Dr. Benali',
        text: message,
      });
      return;
    } catch (err: any) {
      console.error('[EMAIL] SMTP error:', err?.message);
    }
  }
  console.log(`[EMAIL] Verification code for ${email}: ${code}`);
}

export async function sendResetCode(email: string, code: string): Promise<void> {
  const t = getTransporter();
  const message = `Bonjour,\n\nVotre code de réinitialisation de mot de passe est : ${code}\n\nCe code expire dans 15 minutes.\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.\n\nCordialement,\nDr. Amine Benali`;

  if (t) {
    try {
      await t.sendMail({
        from: FROM_ADDRESS,
        to: email,
        subject: 'Réinitialisation de mot de passe - Dr. Benali',
        text: message,
      });
      return;
    } catch (err: any) {
      console.error('[EMAIL] SMTP error:', err?.message);
    }
  }
  console.log(`[EMAIL] Reset code for ${email}: ${code}`);
}
