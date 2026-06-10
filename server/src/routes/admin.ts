import { Router, Response } from 'express';
import { get, all, run } from '../database.js';
import { requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/patients/export', requireAdmin, async (_req: AuthRequest, res: Response) => {
  const patients: any[] = await all(`
    SELECT p.id, p.first_name, p.last_name, p.email, p.phone, p.created_at,
      (SELECT COUNT(*) FROM appointments a WHERE a.patient_id = p.id) as total_rdv,
      (SELECT COUNT(*) FROM appointments a WHERE a.patient_id = p.id AND a.status = 'completed') as completed_rdv,
      (SELECT COUNT(*) FROM appointments a WHERE a.patient_id = p.id AND a.status = 'cancelled') as cancelled_rdv,
      (SELECT COUNT(*) FROM appointments a WHERE a.patient_id = p.id AND a.status = 'pending') as pending_rdv,
      (SELECT a.date FROM appointments a WHERE a.patient_id = p.id ORDER BY a.created_at DESC LIMIT 1) as last_rdv_date,
      (SELECT a.time_slot FROM appointments a WHERE a.patient_id = p.id ORDER BY a.created_at DESC LIMIT 1) as last_rdv_time,
      (SELECT a.status FROM appointments a WHERE a.patient_id = p.id ORDER BY a.created_at DESC LIMIT 1) as last_rdv_status,
      (SELECT COUNT(*) FROM patient_messages m WHERE m.patient_id = p.id) as total_messages,
      (SELECT COUNT(*) FROM patient_documents d WHERE d.patient_id = p.id) as total_documents
    FROM patients p ORDER BY p.created_at DESC
  `);

  const header = 'ID;Prénom;Nom;Email;Téléphone;Inscrit le;Total RDV;RDV effectués;RDV annulés;RDV en attente;Dernier RDV (date);Dernier RDV (heure);Dernier RDV (statut)';
  const rows = patients.map(p =>
    `${p.id};${p.first_name};${p.last_name};${p.email};${p.phone};${new Date(p.created_at).toLocaleDateString('fr-FR')};${p.total_rdv};${p.completed_rdv};${p.cancelled_rdv};${p.pending_rdv};${p.last_rdv_date || ''};${p.last_rdv_time || ''};${p.last_rdv_status || ''}`
  );

  const csv = '\uFEFF' + header + '\n' + rows.join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=patients.csv');
  res.send(csv);
});

router.get('/stats', requireAdmin, async (_req: AuthRequest, res: Response) => {
  const today = new Date().toISOString().split('T')[0];
  const thisMonth = today.slice(0, 7);

  const todayAppts: any = await get("SELECT COUNT(*)::int as count FROM appointments WHERE date = ?", today);
  const totalPatients: any = await get("SELECT COUNT(*)::int as count FROM patients");
  const monthAppts: any = await get("SELECT COUNT(*)::int as count FROM appointments WHERE date::text LIKE ?", `${thisMonth}%`);
  const pendingAppts: any = await get("SELECT COUNT(*)::int as count FROM appointments WHERE status = 'pending'");
  const completedAppts: any = await get("SELECT COUNT(*)::int as count FROM appointments WHERE status = 'completed'");
  const unreadMessages: any = await get("SELECT COUNT(*)::int as count FROM contact_messages WHERE read = FALSE");

  const todayList: any[] = await all(
    'SELECT a.*, p.first_name as patient_first, p.last_name as patient_last FROM appointments a LEFT JOIN patients p ON a.patient_id = p.id WHERE a.date = ? ORDER BY a.time_slot',
    today
  );

  const recentPatients: any[] = await all(
    'SELECT id, first_name, last_name, phone, created_at FROM patients ORDER BY created_at DESC LIMIT 5'
  );

  const recentMessages: any[] = await all(
    'SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5'
  );

  res.json({
    stats: {
      todayAppointments: todayAppts?.count || 0,
      totalPatients: totalPatients?.count || 0,
      monthAppointments: monthAppts?.count || 0,
      pendingAppointments: pendingAppts?.count || 0,
      completedAppointments: completedAppts?.count || 0,
      unreadMessages: unreadMessages?.count || 0,
    },
    todayAppointments: todayList.map((a: any) => ({
      id: a.id,
      patient: `${a.first_name} ${a.last_name}`,
      time: a.time_slot,
      type: a.motif || 'Consultation',
      status: a.status,
      mode: 'in-person',
    })),
    recentPatients: recentPatients.map((p: any) => ({
      id: p.id,
      name: `${p.first_name} ${p.last_name}`,
      lastVisit: p.created_at,
      visits: 0,
    })),
    recentMessages,
  });
});

export default router;
