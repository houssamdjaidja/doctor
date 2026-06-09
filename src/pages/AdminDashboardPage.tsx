/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Users, FileText, BarChart3, Settings, Bell, Search,
  ChevronRight, TrendingUp, TrendingDown, Stethoscope, LogOut,
  Plus, Edit3, Trash2, X, Send, Reply, Lock, ArrowLeft, Eye, Download,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";

const categories = [
  { value: "prevention", label: "Prévention" },
  { value: "nutrition", label: "Nutrition" },
  { value: "general", label: "Santé générale" },
  { value: "news", label: "Actualités" },
  { value: "advice", label: "Conseils santé" },
  { value: "wellness", label: "Bien-être" },
];

const statusColors: Record<string, "success" | "info" | "warning" | "default"> = {
  completed: "success", confirmed: "success", "in-progress": "info",
  pending: "warning", cancelled: "default",
};
const statusLabels: Record<string, string> = {
  completed: "Terminé", confirmed: "Confirmé", "in-progress": "En cours",
  pending: "En attente", cancelled: "Annulé",
};

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={onClose}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [blogArticles, setBlogArticles] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [blogModal, setBlogModal] = useState<{ mode: "create" | "edit"; article?: any } | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [settingsForm, setSettingsForm] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [patientMsgs, setPatientMsgs] = useState<any[]>([]);
  const [replyModal, setReplyModal] = useState<{ id: number; patientName: string } | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [selectedApt, setSelectedApt] = useState<any>(null);
  const [patientDocs, setPatientDocs] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const navigate = useNavigate();

  function loadAll() {
    Promise.all([
      api.getAdminStats().catch(() => null),
      api.getPatients().catch(() => []),
      api.getBlogPosts({ published: "false" }).then((posts) => {
        const published = posts.filter((p: any) => p.published);
        const drafts = posts.filter((p: any) => !p.published);
        return [...published, ...drafts];
      }).catch(() => []),
      api.getAppointments().catch(() => []),
      api.getMessages().catch(() => []),
      api.getAdminMessages().catch(() => []),
      api.getSettings().catch(() => ({}) as Record<string, string>),
    ])
      .then(([s, p, b, a, m, pm, sett]) => {
        setStats(s); setPatients(p); setBlogArticles(b);
        setAppointments(a); setMessages(m); setPatientMsgs(pm); setSettings(sett);
        setSettingsForm({
          clinic_name: sett.clinic_name || "Cabinet Dr. Benali",
          email: sett.email || "contact@dr-benali.dz",
          phone: sett.phone || "+213 21 23 45 67",
          address: sett.address || "24 Rue Didouche Mourad, 16000 Alger",
        });
      })
      .catch(() => navigate("/patient/login"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) { navigate("/patient/login"); return; }
    loadAll();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function viewAppointmentDetail(apt: any) {
    setSelectedApt(apt);
    if (apt.patient_id) {
      setLoadingDocs(true);
      api.getDocuments(apt.patient_id).then(setPatientDocs).catch(() => setPatientDocs([])).finally(() => setLoadingDocs(false));
    } else {
      setPatientDocs([]);
    }
  }

  function downloadPatientDoc(doc: any) {
    api.downloadDocument(doc.id).then((d) => {
      const blob = new Blob([Uint8Array.from(atob(d.file_data), (c) => c.charCodeAt(0))], { type: d.file_type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = d.name; a.click();
      URL.revokeObjectURL(url);
    }).catch(() => alert("Erreur lors du téléchargement"));
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  async function saveBlog(article: any) {
    setSaving(true);
    try {
      if (blogModal?.mode === "create") {
        const created = await api.createBlogPost(article);
        setBlogArticles([created, ...blogArticles]);
      } else if (blogModal?.article?.id) {
        const updated = await api.updateBlogPost(blogModal.article.id, article);
        setBlogArticles(blogArticles.map((a) => (a.id === updated.id ? updated : a)));
      }
      setBlogModal(null);
    } catch (e: any) { alert(e.message); }
    finally { setSaving(false); }
  }

  async function deleteArticle(id: number) {
    try {
      await api.deleteBlogPost(id);
      setBlogArticles(blogArticles.filter((a) => a.id !== id));
      setDeleteId(null);
    } catch (e: any) { alert(e.message); }
  }

  async function updateAppointmentStatus(id: number, status: string) {
    try {
      const updated = await api.updateAppointment(id, { status });
      setAppointments(appointments.map((a) => (a.id === id ? { ...a, status: updated.status } : a)));
    } catch (e: any) { alert(e.message); }
  }

  async function saveSettings() {
    setSaving(true);
    try {
      const updated = await api.updateSettings(settingsForm);
      setSettings(updated);
      alert("Paramètres enregistrés");
    } catch (e: any) { alert(e.message); }
    finally { setSaving(false); }
  }

  async function markRead(id: number) {
    try {
      await api.markMessageRead(id);
      setMessages(messages.map((m) => (m.id === id ? { ...m, read: 1 } : m)));
    } catch { /* ignore */ }
  }

  async function deleteMsg(id: number) {
    try {
      await api.deleteMessage(id);
      setMessages(messages.filter((m) => m.id !== id));
    } catch { /* ignore */ }
  }

  async function replyToPatient(msgId: number) {
    if (!replyText) return;
    setSaving(true);
    try {
      const updated = await api.replyToMessage(msgId, replyText);
      setPatientMsgs(patientMsgs.map((m) => (m.id === msgId ? { ...m, reply: updated.reply, reply_at: updated.reply_at, read_by_patient: 0 } : m)));
      setReplyModal(null); setReplyText("");
    } catch (e: any) { alert(e.message); }
    finally { setSaving(false); }
  }

  async function changeAdminPassword() {
    if (pwNew !== pwConfirm) { alert("Les mots de passe ne correspondent pas"); return; }
    if (pwNew.length < 8) { alert("Le mot de passe doit contenir au moins 8 caractères"); return; }
    setSaving(true);
    try {
      await api.changeAdminPassword(pwCurrent, pwNew);
      alert("Mot de passe modifié avec succès");
      setShowPassword(false); setPwCurrent(""); setPwNew(""); setPwConfirm("");
    } catch (e: any) { alert(e.message); }
    finally { setSaving(false); }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-slate-500">Chargement...</p>
      </div>
    );
  }

  const statCards = [
    { title: "Rendez-vous aujourd'hui", value: stats?.stats?.todayAppointments || "0", change: stats?.stats?.pendingAppointments ? `+${stats.stats.pendingAppointments}` : "0", trend: "up" as const, icon: Calendar, color: "emerald" },
    { title: "Patients", value: stats?.stats?.totalPatients || "0", change: `+${stats?.stats?.totalPatients || 0}`, trend: "up" as const, icon: Users, color: "blue" },
    { title: "Consultations ce mois", value: stats?.stats?.monthAppointments || "0", change: "+0%", trend: "up" as const, icon: BarChart3, color: "purple" },
    { title: "Messages non lus", value: stats?.stats?.unreadMessages || "0", change: stats?.stats?.unreadMessages > 0 ? "Nouveaux" : "", trend: stats?.stats?.unreadMessages > 0 ? "up" as const : "down" as const, icon: TrendingUp, color: "amber" },
  ];

  const nav = [
    { id: "dashboard", label: "Tableau de bord", icon: BarChart3 },
    { id: "appointments", label: "Rendez-vous", icon: Calendar },
    { id: "patients", label: "Patients", icon: Users },
    { id: "blog", label: "Blog", icon: FileText },
    { id: "messages", label: "Messages", icon: Send },
    { id: "settings", label: "Paramètres", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white p-4 hidden lg:block">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div><span className="font-bold">Dr. Benali</span><p className="text-xs text-slate-400">Administration</p></div>
        </div>
        <nav className="space-y-1">
          {nav.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? "bg-emerald-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
              <item.icon className="w-5 h-5" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all w-full">
            <LogOut className="w-5 h-5" /> Déconnexion
          </button>
        </div>
      </aside>

      <main className="lg:ml-64">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input placeholder="Rechercher..." className="pl-10 w-64" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 rounded-lg hover:bg-slate-100">
                  <Bell className="w-5 h-5 text-slate-600" />
                  {(stats?.stats?.unreadMessages > 0 || patientMsgs.some((m: any) => !m.read_by_admin)) && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
                </button>
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50"
                    onMouseLeave={() => setShowNotifications(false)}>
                    <div className="p-3 border-b border-slate-100"><p className="font-semibold text-slate-800 text-sm">Notifications</p></div>
                    <div className="max-h-60 overflow-y-auto">
                      {stats?.todayAppointments?.length > 0 && stats.todayAppointments.map((apt: any) => (
                        <div key={`n-${apt.id}`} className="px-3 py-2 hover:bg-slate-50 text-sm flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-emerald-500" />
                          <span className="text-slate-600">Rendez-vous: {apt.patient} à {apt.time}</span>
                        </div>
                      ))}
                      {patientMsgs.filter((m: any) => !m.read_by_admin).map((msg: any) => (
                        <div key={`nm-${msg.id}`} className="px-3 py-2 hover:bg-slate-50 text-sm flex items-center gap-2">
                          <Send className="w-4 h-4 text-blue-500" />
                          <span className="text-slate-600">Message de {msg.first_name} {msg.last_name}: {msg.subject}</span>
                        </div>
                      ))}
                      {(!stats?.todayAppointments?.length && patientMsgs.filter((m: any) => !m.read_by_admin).length === 0) && (
                        <p className="px-3 py-4 text-sm text-slate-500 text-center">Aucune notification</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold">AD</div>
                <div className="hidden md:block"><p className="font-medium text-slate-800">Administrateur</p><p className="text-xs text-slate-500">Administrateur</p></div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                  <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card variant="elevated" hover={false}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-slate-500 mb-1">{stat.title}</p>
                          <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                          {stat.change && (
                            <div className="flex items-center gap-1 mt-2">
                              {stat.trend === "up" ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
                              <span className={`${stat.trend === "up" ? "text-emerald-500" : "text-red-500"} text-sm font-medium`}>{stat.change}</span>
                            </div>
                          )}
                        </div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color === "emerald" ? "bg-emerald-100" : stat.color === "blue" ? "bg-blue-100" : stat.color === "purple" ? "bg-purple-100" : "bg-amber-100"}`}>
                          <stat.icon className={`w-6 h-6 ${stat.color === "emerald" ? "text-emerald-600" : stat.color === "blue" ? "text-blue-600" : stat.color === "purple" ? "text-purple-600" : "text-amber-600"}`} />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div className="grid lg:grid-cols-2 gap-6">
                <Card variant="elevated" hover={false}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-800">Rendez-vous d'aujourd'hui</h2>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("appointments")}>Voir tout <ChevronRight className="w-4 h-4" /></Button>
                  </div>
                  {stats?.todayAppointments?.length === 0 ? (
                    <p className="text-slate-500 text-sm py-4 text-center">Aucun rendez-vous aujourd'hui</p>
                  ) : (
                    <div className="space-y-3">
                      {stats?.todayAppointments?.map((apt: any) => (
                        <div key={apt.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                          <div className="flex items-center gap-4">
                            <div className="text-center min-w-[60px]"><p className="text-lg font-bold text-slate-800">{apt.time}</p></div>
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-semibold text-sm">
                                {apt.patient?.split(" ").map((n: string) => n[0]).join("")}
                              </div>
                              <div><p className="font-medium text-slate-800">{apt.patient}</p><p className="text-sm text-slate-500">{apt.type}</p></div>
                            </div>
                          </div>
                          <Badge variant={statusColors[apt.status] || "default"}>{statusLabels[apt.status] || apt.status}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
                <Card variant="elevated" hover={false}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-800">Patients récents</h2>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab("patients")}>Voir tout</Button>
                  </div>
                  {patients.length === 0 ? <p className="text-slate-500 text-sm py-4 text-center">Aucun patient</p> : (
                    <div className="space-y-3">
                      {patients.slice(0, 5).map((patient) => (
                        <div key={patient.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                              {patient.first_name?.[0]}{patient.last_name?.[0]}
                            </div>
                            <div><p className="font-medium text-slate-800">{patient.first_name} {patient.last_name}</p><p className="text-xs text-slate-500">{patient.created_at?.split(" ")[0]}</p></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </motion.div>
          </div>
        )}

        {/* Appointments */}
        {activeTab === "appointments" && (
          <div className="p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Gestion des rendez-vous</h1>
                <Link to="/appointment"><Button><Plus className="w-4 h-4" /> Nouveau RDV</Button></Link>
              </div>
              <Card variant="elevated" hover={false}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Patient</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Date & Heure</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Motif</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Statut</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.filter((a) => !searchQuery || `${a.first_name} ${a.last_name} ${a.motif || ""} ${a.date}`.toLowerCase().includes(searchQuery.toLowerCase())).map((apt) => (
                        <tr key={apt.id} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                          onClick={() => viewAppointmentDetail(apt)}>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{apt.first_name} {apt.last_name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{apt.date} {apt.time_slot}</td>
                          <td className="py-3 px-4 text-slate-600">{apt.motif || "Consultation"}</td>
                          <td className="py-3 px-4">
                            <select value={apt.status} onChange={(e) => { e.stopPropagation(); updateAppointmentStatus(apt.id, e.target.value); }}
                              className="rounded-lg border border-slate-200 px-2 py-1 text-sm bg-white">
                              <option value="pending">En attente</option>
                              <option value="confirmed">Confirmé</option>
                              <option value="in-progress">En cours</option>
                              <option value="completed">Terminé</option>
                              <option value="cancelled">Annulé</option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button onClick={(e) => { e.stopPropagation(); viewAppointmentDetail(apt); }}
                                className="p-2 rounded-lg hover:bg-slate-100 text-blue-600"><Eye className="w-4 h-4" /></button>
                              <button onClick={(e) => { e.stopPropagation(); updateAppointmentStatus(apt.id, "cancelled"); }}
                                className="text-red-500 hover:text-red-700 text-sm font-medium">Annuler</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {appointments.filter((a) => !searchQuery || `${a.first_name} ${a.last_name} ${a.motif || ""} ${a.date}`.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                        <tr><td colSpan={5} className="py-8 text-center text-slate-500">Aucun rendez-vous</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Patients */}
        {activeTab === "patients" && (
          <div className="p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Gestion des patients</h1>
                <Button onClick={async () => {
                  try {
                    const res = await api.exportPatients();
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url; a.download = 'patients.csv'; a.click();
                    URL.revokeObjectURL(url);
                  } catch { alert('Erreur lors de l\'export'); }
                }}>
                  Télécharger
                </Button>
              </div>
              <Card variant="elevated" hover={false}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Patient</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Téléphone</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Inscrit le</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient) => (
                        <tr key={patient.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
                                {patient.first_name?.[0]}{patient.last_name?.[0]}
                              </div>
                              <span className="font-medium">{patient.first_name} {patient.last_name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{patient.email}</td>
                          <td className="py-3 px-4 text-slate-600">{patient.phone}</td>
                          <td className="py-3 px-4 text-slate-600">{patient.created_at?.split(" ")[0]}</td>
                        </tr>
                      ))}
                      {patients.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-slate-500">Aucun patient</td></tr>}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Blog */}
        {activeTab === "blog" && (
          <div className="p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Gestion du blog</h1>
                <Button onClick={() => setBlogModal({ mode: "create" })}><Plus className="w-4 h-4" /> Nouvel article</Button>
              </div>
              <Card variant="elevated" hover={false}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Titre</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Catégorie</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Statut</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blogArticles.map((article) => (
                        <tr key={article.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="py-3 px-4 font-medium">{article.title}</td>
                          <td className="py-3 px-4 text-slate-600">{categories.find((c) => c.value === article.category)?.label || article.category}</td>
                          <td className="py-3 px-4">
                            <Badge variant={article.published ? "success" : "warning"}>{article.published ? "Publié" : "Brouillon"}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => setBlogModal({ mode: "edit", article })} className="p-2 rounded-lg hover:bg-slate-100 text-blue-600"><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => setDeleteId(article.id)} className="p-2 rounded-lg hover:bg-slate-100 text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {blogArticles.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-slate-500">Aucun article</td></tr>}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Messages */}
        {activeTab === "messages" && (
          <div className="p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <h1 className="text-2xl font-bold text-slate-800">Messages</h1>

              {/* Contact form messages */}
              <Card variant="elevated" hover={false}>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Messages du site</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Nom</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Sujet</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messages.filter((m) => !searchQuery || m.name?.toLowerCase().includes(searchQuery.toLowerCase())).map((msg) => (
                        <tr key={msg.id} className={`border-b border-slate-100 hover:bg-slate-50 ${!msg.read ? "bg-blue-50/50" : ""}`}>
                          <td className="py-3 px-4"><span className={`font-medium ${!msg.read ? "text-slate-800" : "text-slate-600"}`}>{msg.name}</span></td>
                          <td className="py-3 px-4 text-slate-600">{msg.email}</td>
                          <td className="py-3 px-4 text-slate-600">{msg.subject || "—"}</td>
                          <td className="py-3 px-4 text-slate-600">{msg.created_at?.split(" ")[0]}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {!msg.read && <button onClick={() => markRead(msg.id)} className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">Marquer lu</button>}
                              <button onClick={() => deleteMsg(msg.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Supprimer</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {messages.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-slate-500">Aucun message</td></tr>}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* Patient messages */}
              <Card variant="elevated" hover={false}>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Messages des patients</h2>
                {patientMsgs.length === 0 ? (
                  <p className="text-slate-500 text-sm py-4 text-center">Aucun message de patient</p>
                ) : (
                  <div className="space-y-4">
                    {patientMsgs.filter((m) => !searchQuery || m.subject?.toLowerCase().includes(searchQuery.toLowerCase()) || m.first_name?.toLowerCase().includes(searchQuery.toLowerCase())).map((msg) => (
                      <div key={msg.id} className={`p-4 rounded-xl border ${!msg.read_by_admin ? "border-blue-200 bg-blue-50/50" : "border-slate-100"}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-800">{msg.first_name} {msg.last_name}</span>
                              <span className="text-xs text-slate-500">({msg.patient_email})</span>
                              {!msg.read_by_admin && <Badge variant="info">Nouveau</Badge>}
                            </div>
                            <p className="font-medium text-slate-700 mt-1">{msg.subject}</p>
                            <p className="text-xs text-slate-500">{msg.created_at?.split(" ")[0]}</p>
                          </div>
                          {!msg.reply && (
                            <button onClick={() => setReplyModal({ id: msg.id, patientName: `${msg.first_name} ${msg.last_name}` })}
                              className="p-2 rounded-lg hover:bg-emerald-100 text-emerald-600"><Reply className="w-4 h-4" /></button>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 p-3 rounded-lg bg-white border border-slate-100">{msg.message}</p>
                        {msg.reply && (
                          <div className="mt-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                            <p className="text-xs text-emerald-600 font-medium mb-1">Votre réponse ({msg.reply_at?.split(" ")[0]})</p>
                            <p className="text-sm text-slate-700">{msg.reply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        )}

        {/* Settings */}
        {activeTab === "settings" && (
          <div className="p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl font-bold text-slate-800 mb-6">Paramètres</h1>
              <Card variant="elevated" hover={false}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom du cabinet</label>
                    <Input value={settingsForm.clinic_name || ""} onChange={(e) => setSettingsForm({ ...settingsForm, clinic_name: e.target.value })} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <Input value={settingsForm.email || ""} onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                      <Input value={settingsForm.phone || ""} onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
                    <Input value={settingsForm.address || ""} onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })} />
                  </div>
                  <Button onClick={saveSettings} disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer les modifications"}</Button>
                </div>
              </Card>
              <Card variant="elevated" hover={false} className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-800">Mot de passe administrateur</h2>
                  <Button variant="secondary" size="sm" onClick={() => setShowPassword(true)}><Lock className="w-4 h-4" /> Modifier</Button>
                </div>
                <p className="text-sm text-slate-500">Le mot de passe doit contenir au moins 8 caractères.</p>
              </Card>
            </motion.div>
          </div>
        )}
      </main>

      {/* Blog Modal */}
      <Modal open={!!blogModal} onClose={() => setBlogModal(null)}
        title={blogModal?.mode === "create" ? "Nouvel article" : "Modifier l'article"}>
        <BlogForm article={blogModal?.article} onSave={saveBlog} saving={saving} />
      </Modal>

      {/* Delete confirmation */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Confirmer la suppression">
        <p className="text-slate-600 mb-6">Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Annuler</Button>
          <Button onClick={() => deleteId && deleteArticle(deleteId)} className="bg-red-600 hover:bg-red-700">Supprimer</Button>
        </div>
      </Modal>

      {/* Reply modal */}
      <Modal open={!!replyModal} onClose={() => { setReplyModal(null); setReplyText(""); }} title={`Répondre à ${replyModal?.patientName || ""}`}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Votre réponse</label>
            <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={5}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white resize-none" placeholder="Écrivez votre réponse..." />
          </div>
          <div className="flex justify-end">
            <Button onClick={() => replyModal && replyToPatient(replyModal.id)} disabled={saving || !replyText}>
              <Send className="w-4 h-4" /> Envoyer
            </Button>
          </div>
        </div>
      </Modal>

      {/* Appointment Detail Modal */}
      <Modal open={!!selectedApt} onClose={() => setSelectedApt(null)} title="Détails du rendez-vous">
        {selectedApt && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-slate-500">Patient</p><p className="font-medium">{selectedApt.first_name} {selectedApt.last_name}</p></div>
              <div><p className="text-sm text-slate-500">Téléphone</p><p className="font-medium">{selectedApt.phone || "—"}</p></div>
              <div><p className="text-sm text-slate-500">Date</p><p className="font-medium">{selectedApt.date}</p></div>
              <div><p className="text-sm text-slate-500">Heure</p><p className="font-medium">{selectedApt.time_slot}</p></div>
              <div><p className="text-sm text-slate-500">Motif</p><p className="font-medium">{selectedApt.motif || "Consultation"}</p></div>
              <div><p className="text-sm text-slate-500">Statut</p><p className="font-medium">{statusLabels[selectedApt.status] || selectedApt.status}</p></div>
              {selectedApt.email && <div className="col-span-2"><p className="text-sm text-slate-500">Email</p><p className="font-medium">{selectedApt.email}</p></div>}
              {selectedApt.notes && <div className="col-span-2"><p className="text-sm text-slate-500">Notes</p><p className="font-medium">{selectedApt.notes}</p></div>}
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="font-semibold text-slate-800 mb-3">Documents du patient</h3>
              {!selectedApt.patient_id ? (
                <p className="text-sm text-slate-400">Aucun compte patient lié à ce rendez-vous.</p>
              ) : loadingDocs ? (
                <p className="text-sm text-slate-400">Chargement...</p>
              ) : patientDocs.length === 0 ? (
                <p className="text-sm text-slate-400">Aucun document.</p>
              ) : (
                <div className="space-y-2">
                  {patientDocs.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{doc.name}</p>
                        <p className="text-xs text-slate-400">{doc.file_type} — {Math.ceil(doc.file_size / 1024)} Ko</p>
                      </div>
                      <button onClick={() => downloadPatientDoc(doc)}
                        className="p-2 rounded-lg hover:bg-slate-200 text-blue-600">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Admin password modal */}
      <Modal open={showPassword} onClose={() => setShowPassword(false)} title="Modifier le mot de passe">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe actuel</label><Input type="password" value={pwCurrent} onChange={(e) => setPwCurrent(e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Nouveau mot de passe</label><Input type="password" value={pwNew} onChange={(e) => setPwNew(e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Confirmer</label><Input type="password" value={pwConfirm} onChange={(e) => setPwConfirm(e.target.value)} /></div>
          <div className="flex justify-end"><Button onClick={changeAdminPassword} disabled={saving || !pwCurrent || !pwNew || !pwConfirm}><Lock className="w-4 h-4" /> Modifier</Button></div>
        </div>
      </Modal>
    </div>
  );
}

function BlogForm({ article, onSave, saving }: { article?: any; onSave: (data: any) => Promise<void>; saving: boolean }) {
  const [title, setTitle] = useState(article?.title || "");
  const [category, setCategory] = useState(article?.category || "general");
  const [excerpt, setExcerpt] = useState(article?.excerpt || "");
  const [content, setContent] = useState(article?.content || "");
  const [author, setAuthor] = useState(article?.author || "Dr. Amine Benali");
  const [imageUrl, setImageUrl] = useState(article?.image_url || "");
  const [published, setPublished] = useState(!!article?.published);
  const [featured, setFeatured] = useState(!!article?.featured);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({ title, category, excerpt, content, author, imageUrl, published, featured });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="block text-sm font-medium text-slate-700 mb-1">Titre *</label><Input value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
      <div><label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white">
          {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>
      <div><label className="block text-sm font-medium text-slate-700 mb-1">Extrait</label>
        <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white resize-none" />
      </div>
      <div><label className="block text-sm font-medium text-slate-700 mb-1">Contenu</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white resize-none" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Auteur</label><Input value={author} onChange={(e) => setAuthor(e.target.value)} /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label><Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} /></div>
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="rounded" /> Publié</label>
        <label className="flex items-center gap-2 text-sm text-slate-700"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="rounded" /> À la une</label>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button type="submit" disabled={saving}>{saving ? "Enregistrement..." : article ? "Enregistrer" : "Publier"}</Button>
      </div>
    </form>
  );
}
