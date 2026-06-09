import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar, Clock, User, Phone, Mail, FileText, MapPin,
  ArrowLeft, AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";

const statusStyles: Record<string, "success" | "info" | "warning" | "default"> = {
  completed: "success", confirmed: "success", "in-progress": "info",
  pending: "warning", cancelled: "default",
};

const statusLabels: Record<string, string> = {
  completed: "Terminé", confirmed: "Confirmé", "in-progress": "En cours",
  pending: "En attente", cancelled: "Annulé",
};

export function AppointmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/patient/login"); return; }
    if (!id) return;
    api.getAppointment(Number(id))
      .then(setAppointment)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function cancelAppointment() {
    if (!window.confirm("Annuler ce rendez-vous ?")) return;
    try {
      const updated = await api.cancelAppointment(Number(id));
      setAppointment(updated);
    } catch (e: any) { alert(e.message); }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <p className="text-slate-500">Chargement...</p>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">{error || "Rendez-vous non trouvé"}</p>
          <Link to="/patient/dashboard"><Button variant="secondary"><ArrowLeft className="w-4 h-4" /> Retour au tableau de bord</Button></Link>
        </div>
      </div>
    );
  }

  const isPending = appointment.status === "pending" || appointment.status === "confirmed";
  const dateObj = appointment.date ? new Date(appointment.date + "T00:00:00") : null;
  const formattedDate = dateObj ? dateObj.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : appointment.date;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-slate-800">Détail du rendez-vous</h1>
              <p className="text-xs text-slate-500">#{appointment.id}</p>
            </div>
            <div className="ml-auto">
              <Badge variant={statusStyles[appointment.status] || "default"}>
                {statusLabels[appointment.status] || appointment.status}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card variant="elevated">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" /> Date & Heure
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <Calendar className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-500">Date</p>
                  <p className="font-medium text-slate-800 capitalize">{formattedDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <Clock className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-500">Horaire</p>
                  <p className="font-medium text-slate-800">{appointment.time_slot}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card variant="elevated">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" /> Informations patient
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <User className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-500">Nom complet</p>
                  <p className="font-medium text-slate-800">{appointment.first_name} {appointment.last_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-500">Téléphone</p>
                  <p className="font-medium text-slate-800">{appointment.phone}</p>
                </div>
              </div>
              {appointment.email && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                  <Mail className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-slate-500">Email</p>
                    <p className="font-medium text-slate-800">{appointment.email}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-500">Cabinet</p>
                  <p className="font-medium text-slate-800">Dr. Benali</p>
                </div>
              </div>
            </div>
          </Card>

          {appointment.motif && (
            <Card variant="elevated">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" /> Motif de consultation
              </h2>
              <p className="text-slate-700">{appointment.motif}</p>
            </Card>
          )}

          {appointment.notes && (
            <Card variant="elevated">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" /> Notes
              </h2>
              <p className="text-slate-700 whitespace-pre-wrap">{appointment.notes}</p>
            </Card>
          )}

          <div className="bg-emerald-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-emerald-800">
                <p className="font-medium mb-1">Important</p>
                <p>Merci d'arriver 10 minutes avant l'heure prévue. En cas d'empêchement, veuillez annuler votre rendez-vous au moins 24h à l'avance.</p>
              </div>
            </div>
          </div>

          {isPending && (
            <div className="flex justify-between">
              <Link to="/patient/dashboard">
                <Button variant="secondary"><ArrowLeft className="w-4 h-4" /> Retour</Button>
              </Link>
              <Button onClick={cancelAppointment} className="bg-red-600 hover:bg-red-700">
                Annuler ce rendez-vous
              </Button>
            </div>
          )}

          {!isPending && (
            <div className="flex justify-start">
              <Link to="/patient/dashboard">
                <Button variant="secondary"><ArrowLeft className="w-4 h-4" /> Retour au tableau de bord</Button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
