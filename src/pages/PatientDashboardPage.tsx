/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, FileText, MessageSquare, User, Settings, Bell,
  ChevronRight, Stethoscope, LogOut, X, Send, Upload, Download,
  Trash2, Plus, Lock, ArrowLeft, Clock, Phone, Mail, MapPin, AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PatientDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [patient, setPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPast, setShowPast] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", phone: "" });
  const navigate = useNavigate();

  // Message modal
  const [showNewMsg, setShowNewMsg] = useState(false);
  const [msgSubject, setMsgSubject] = useState("");
  const [msgBody, setMsgBody] = useState("");

  // Document modal
  const [showUpload, setShowUpload] = useState(false);
  const [docName, setDocName] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);

  // Password modal
  const [showPassword, setShowPassword] = useState(false);
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");

  // Appointment detail modal
  const [detailApt, setDetailApt] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  function loadAll() {
    Promise.all([
      api.getPatientMe().catch(() => null),
      api.getAppointments().catch(() => [] as any[]),
      api.getPatientMessages().catch(() => []),
      api.getDocuments().catch(() => []),
    ])
      .then(([p, apps, msgs, docs]) => {
        if (!p) { navigate("/patient/login"); return; }
        setPatient(p);
        setAppointments(apps);
        setMessages(msgs);
        setDocuments(docs);
        setEditForm({ firstName: p.first_name || "", lastName: p.last_name || "", phone: p.phone || "" });
      })
      .catch(() => navigate("/patient/login"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/patient/login"); return; }
    loadAll();
  }, [navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = () => { localStorage.removeItem("token"); navigate("/patient/login"); };

  async function cancelAppointment(id: number) {
    if (!window.confirm("Annuler ce rendez-vous ?")) return;
    try {
      const updated = await api.cancelAppointment(id);
      setAppointments(appointments.map((a) => (a.id === id ? { ...a, status: updated.status } : a)));
    } catch (e: any) { alert(e.message); }
  }

  async function saveProfile() {
    setSaving(true);
    try {
      const updated = await api.updatePatientMe(editForm);
      setPatient(updated);
      alert("Profil mis à jour");
    } catch (e: any) { alert(e.message); }
    finally { setSaving(false); }
  }

  async function sendMessage() {
    if (!msgSubject || !msgBody) return;
    setSaving(true);
    try {
      const msg = await api.sendPatientMessage(msgSubject, msgBody);
      setMessages([msg, ...messages]);
      setShowNewMsg(false);
      setMsgSubject(""); setMsgBody("");
    } catch (e: any) { alert(e.message); }
    finally { setSaving(false); }
  }

  async function markMsgRead(id: number) {
    try { await api.markMessageReadPatient(id); setMessages(messages.map((m) => m.id === id ? { ...m, read_by_patient: 1 } : m)); }
    catch { /* ignore */ }
  }

  function handleDocFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) setDocFile(e.target.files[0]);
  }

  async function uploadDocument() {
    if (!docFile || !docName) return;
    setSaving(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        await api.uploadDocument({ name: docName, file_type: docFile.type || "application/octet-stream", file_data: base64 });
        setShowUpload(false); setDocName(""); setDocFile(null);
        const docs = await api.getDocuments();
        setDocuments(docs);
      };
      reader.readAsDataURL(docFile);
    } catch (e: any) { alert(e.message); }
    finally { setSaving(false); }
  }

  async function downloadDocument(id: number) {
    try {
      const doc = await api.downloadDocument(id);
      const blob = new Blob([Uint8Array.from(atob(doc.file_data), (c) => c.charCodeAt(0))], { type: doc.file_type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = doc.name; a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) { alert(e.message); }
  }

  async function deleteDocument(id: number) {
    if (!window.confirm("Supprimer ce document ?")) return;
    try {
      await api.deleteDocument(id);
      setDocuments(documents.filter((d) => d.id !== id));
    } catch (e: any) { alert(e.message); }
  }

  async function changePassword() {
    if (pwNew !== pwConfirm) { alert("Les mots de passe ne correspondent pas"); return; }
    if (pwNew.length < 8) { alert("Le mot de passe doit contenir au moins 8 caractères"); return; }
    setSaving(true);
    try {
      await api.changePassword(pwCurrent, pwNew);
      alert("Mot de passe modifié avec succès");
      setShowPassword(false); setPwCurrent(""); setPwNew(""); setPwConfirm("");
    } catch (e: any) { alert(e.message); }
    finally { setSaving(false); }
  }

  const upcomingAppointments = appointments.filter((a) => a.status === "pending" || a.status === "confirmed");
  const pastAppointments = appointments.filter((a) => a.status === "completed" || a.status === "cancelled");
  const displayAppointments = showPast ? pastAppointments : upcomingAppointments;
  const unreadMessages = messages.filter((m) => !m.read_by_patient).length;

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
      <p className="text-slate-500">Chargement...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/" className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-slate-800">Dr. Djaidja</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-semibold">
                  {patient?.first_name?.[0] || "?"}
                </div>
                <div className="hidden md:block">
                  <p className="font-medium text-slate-800">{patient?.first_name} {patient?.last_name}</p>
                  <p className="text-xs text-slate-500">Patient</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card variant="glass" hover={false} className="sticky top-24">
              <nav className="space-y-1">
                {[
                  { id: "overview", label: "Tableau de bord", icon: User },
                  { id: "appointments", label: "Rendez-vous", icon: Calendar },
                  { id: "documents", label: "Documents", icon: FileText },
                  { id: "messages", label: "Messages", icon: MessageSquare, badge: unreadMessages },
                  { id: "settings", label: "Paramètres", icon: Settings },
                ].map((item) => (
                  <button key={item.id} onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${activeTab === item.id ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
                    <item.icon className="w-5 h-5" /> {item.label}
                    {(item as any).badge > 0 && <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">{(item as any).badge}</span>}
                  </button>
                ))}
                <hr className="my-2" />
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-100 transition-all">
                  <LogOut className="w-5 h-5" /> Déconnexion
                </button>
              </nav>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 mb-2">Bonjour, {patient?.first_name}</h1>
                  <p className="text-slate-600">Bienvenue sur votre espace patient.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card variant="glass">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center"><Calendar className="w-6 h-6 text-emerald-600" /></div>
                      <div><p className="text-2xl font-bold text-slate-800">{upcomingAppointments.length}</p><p className="text-sm text-slate-500">RDV à venir</p></div>
                    </div>
                  </Card>
                  <Card variant="glass">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center"><FileText className="w-6 h-6 text-blue-600" /></div>
                      <div><p className="text-2xl font-bold text-slate-800">{documents.length}</p><p className="text-sm text-slate-500">Documents</p></div>
                    </div>
                  </Card>
                  <Card variant="glass">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center"><Bell className="w-6 h-6 text-amber-600" /></div>
                      <div><p className="text-2xl font-bold text-slate-800">{unreadMessages}</p><p className="text-sm text-slate-500">Messages non lus</p></div>
                    </div>
                  </Card>
                </div>
                <Card variant="elevated">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-800">Prochains rendez-vous</h2>
                    <Button variant="ghost" size="sm" onClick={() => { setShowPast(false); setActiveTab("appointments"); }}>Voir tout <ChevronRight className="w-4 h-4" /></Button>
                  </div>
                  {upcomingAppointments.length === 0 ? (
                    <p className="text-slate-500 text-sm py-4 text-center">Aucun rendez-vous à venir</p>
                  ) : (
                    <div className="space-y-3">
                      {upcomingAppointments.slice(0, 3).map((apt) => (
                        <button key={apt.id} onClick={() => { setDetailLoading(true); setDetailApt(apt); api.getAppointment(apt.id).then(setDetailApt).catch(() => {}).finally(() => setDetailLoading(false)); }} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 transition-colors w-full text-left">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center"><Calendar className="w-6 h-6 text-emerald-600" /></div>
                            <div>
                              <p className="font-medium text-slate-800">{apt.motif || "Consultation"}</p>
                              <div className="flex items-center gap-2 text-sm text-slate-500"><span>{apt.date}</span><span>•</span><span>{apt.time_slot}</span></div>
                            </div>
                          </div>
                          <Badge variant={apt.status === "confirmed" ? "success" : "warning"}>{apt.status === "confirmed" ? "Confirmé" : "En attente"}</Badge>
                        </button>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {activeTab === "appointments" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-slate-800">Mes rendez-vous</h1>
                  <Link to="/appointment"><Button size="sm"><Calendar className="w-4 h-4" /> Nouveau RDV</Button></Link>
                </div>
                <div className="flex gap-2 mb-2">
                  <button onClick={() => setShowPast(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!showPast ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}>À venir</button>
                  <button onClick={() => setShowPast(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showPast ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}>Historique</button>
                </div>
                <Card variant="elevated">
                  {displayAppointments.length === 0 ? (
                    <p className="text-slate-500 text-sm py-8 text-center">{showPast ? "Aucun historique" : "Aucun rendez-vous à venir"}</p>
                  ) : (
                    <div className="space-y-3">
                      {displayAppointments.map((apt) => (
                        <div key={apt.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors cursor-pointer"
                          onClick={() => { setDetailLoading(true); setDetailApt(apt); api.getAppointment(apt.id).then(setDetailApt).catch(() => {}).finally(() => setDetailLoading(false)); }}>
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <p className="text-lg font-bold text-emerald-600">{apt.date?.split("-")[2]}</p>
                              <p className="text-xs text-slate-500">{apt.date?.split("-")[1]}</p>
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">{apt.motif || "Consultation"}</p>
                              <p className="text-sm text-slate-500">{apt.time_slot}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!showPast && (apt.status === "pending" || apt.status === "confirmed") && (
                              <button onClick={(e) => { e.stopPropagation(); cancelAppointment(apt.id); }} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Annuler"><X className="w-4 h-4" /></button>
                            )}
                            <Badge variant={apt.status === "completed" || apt.status === "confirmed" ? "success" : apt.status === "cancelled" ? "default" : "warning"}>
                              {apt.status === "completed" ? "Terminé" : apt.status === "confirmed" ? "Confirmé" : apt.status === "cancelled" ? "Annulé" : "En attente"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </motion.div>
            )}

            {activeTab === "documents" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-slate-800">Mes documents</h1>
                  <Button onClick={() => setShowUpload(true)}><Upload className="w-4 h-4" /> Ajouter</Button>
                </div>
                {documents.length === 0 ? (
                  <Card variant="glass"><div className="py-8 text-center text-slate-500"><FileText className="w-12 h-12 mx-auto mb-4 text-slate-400" /><p>Aucun document</p></div></Card>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {documents.map((doc) => (
                      <Card key={doc.id} variant="elevated">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center"><FileText className="w-6 h-6 text-blue-600" /></div>
                            <div>
                              <p className="font-medium text-slate-800">{doc.name}</p>
                              <p className="text-xs text-slate-500">{(doc.file_size / 1024).toFixed(1)} Ko • {doc.created_at?.split(" ")[0]}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => downloadDocument(doc.id)} className="p-2 rounded-lg hover:bg-slate-100 text-emerald-600" title="Télécharger"><Download className="w-4 h-4" /></button>
                            <button onClick={() => deleteDocument(doc.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "messages" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-slate-800">Messagerie</h1>
                  <Button onClick={() => setShowNewMsg(true)}><Plus className="w-4 h-4" /> Nouveau message</Button>
                </div>
                {messages.length === 0 ? (
                  <Card variant="glass"><div className="py-8 text-center text-slate-500"><MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-400" /><p>Aucun message</p><p className="text-sm">Envoyez un message au médecin</p></div></Card>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <Card key={msg.id} variant="elevated" className={`${!msg.read_by_patient ? "border-emerald-300 border-2" : ""}`}
                        onClick={() => !msg.read_by_patient && markMsgRead(msg.id)}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-800">{msg.subject}</h3>
                            <p className="text-xs text-slate-500">{msg.created_at?.split(" ")[0]} à {msg.created_at?.split(" ")[1]?.slice(0, 5)}</p>
                          </div>
                          {!msg.read_by_patient && <Badge variant="info">Nouveau</Badge>}
                        </div>
                        <p className="text-slate-600 text-sm mb-3 p-3 rounded-lg bg-slate-50">{msg.message}</p>
                        {msg.reply && (
                          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                            <p className="text-xs text-emerald-600 font-medium mb-1">Réponse du Dr. Djaidja ({msg.reply_at?.split(" ")[0]})</p>
                            <p className="text-sm text-slate-700">{msg.reply}</p>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <h1 className="text-2xl font-bold text-slate-800">Paramètres</h1>
                <Card variant="elevated">
                  <h2 className="text-lg font-semibold text-slate-800 mb-4">Informations personnelles</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label><Input value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} /></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Nom</label><Input value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} /></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Email</label><Input value={patient?.email || ""} readOnly className="bg-slate-50 text-slate-500" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label><Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} /></div>
                  </div>
                  <Button className="mt-4" onClick={saveProfile} disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer les modifications"}</Button>
                </Card>
                <Card variant="elevated">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-800">Mot de passe</h2>
                    <Button variant="secondary" size="sm" onClick={() => setShowPassword(true)}><Lock className="w-4 h-4" /> Modifier</Button>
                  </div>
                  <p className="text-sm text-slate-500">Le mot de passe doit contenir au moins 8 caractères.</p>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* New Message Modal */}
      <Modal open={showNewMsg} onClose={() => setShowNewMsg(false)} title="Nouveau message">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Sujet</label><Input value={msgSubject} onChange={(e) => setMsgSubject(e.target.value)} placeholder="Objet du message" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
            <textarea value={msgBody} onChange={(e) => setMsgBody(e.target.value)} rows={5} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white resize-none" placeholder="Votre message..." />
          </div>
          <div className="flex justify-end"><Button onClick={sendMessage} disabled={saving || !msgSubject || !msgBody}><Send className="w-4 h-4" /> Envoyer</Button></div>
        </div>
      </Modal>

      {/* Upload Document Modal */}
      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Ajouter un document">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Nom du document</label><Input value={docName} onChange={(e) => setDocName(e.target.value)} placeholder="Ex: Ordonnance.pdf" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Fichier</label>
            <input type="file" onChange={handleDocFile} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
          </div>
          <div className="flex justify-end"><Button onClick={uploadDocument} disabled={saving || !docName || !docFile}><Upload className="w-4 h-4" /> Uploader</Button></div>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal open={showPassword} onClose={() => setShowPassword(false)} title="Modifier le mot de passe">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe actuel</label><Input type="password" value={pwCurrent} onChange={(e) => setPwCurrent(e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Nouveau mot de passe</label><Input type="password" value={pwNew} onChange={(e) => setPwNew(e.target.value)} /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Confirmer</label><Input type="password" value={pwConfirm} onChange={(e) => setPwConfirm(e.target.value)} /></div>
          <div className="flex justify-end"><Button onClick={changePassword} disabled={saving || !pwCurrent || !pwNew || !pwConfirm}><Lock className="w-4 h-4" /> Modifier</Button></div>
        </div>
      </Modal>

      {/* Appointment Detail Modal */}
      <Modal open={!!detailApt} onClose={() => setDetailApt(null)} title="Détail du rendez-vous">
        {detailLoading ? (
          <p className="text-slate-500 text-center py-4">Chargement...</p>
        ) : detailApt ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50">
              <Badge variant={detailApt.status === "completed" || detailApt.status === "confirmed" ? "success" : detailApt.status === "cancelled" ? "default" : "warning"}>
                {detailApt.status === "completed" ? "Terminé" : detailApt.status === "confirmed" ? "Confirmé" : detailApt.status === "cancelled" ? "Annulé" : "En attente"}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <div><p className="text-xs text-slate-500">Date</p><p className="text-sm font-medium">{detailApt.date}</p></div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50">
                <Clock className="w-4 h-4 text-emerald-600" />
                <div><p className="text-xs text-slate-500">Horaire</p><p className="text-sm font-medium">{detailApt.time_slot}</p></div>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50">
              <p className="text-xs text-slate-500 mb-1">Patient</p>
              <p className="text-sm font-medium">{detailApt.first_name} {detailApt.last_name}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50">
                <Phone className="w-4 h-4 text-emerald-600" />
                <div><p className="text-xs text-slate-500">Téléphone</p><p className="text-sm font-medium">{detailApt.phone}</p></div>
              </div>
              {detailApt.email && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <div><p className="text-xs text-slate-500">Email</p><p className="text-sm font-medium truncate">{detailApt.email}</p></div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <div><p className="text-xs text-slate-500">Cabinet</p><p className="text-sm font-medium">Dr. Djaidja</p></div>
            </div>
            {detailApt.motif && (
              <div className="p-3 rounded-xl bg-slate-50">
                <p className="text-xs text-slate-500 mb-1">Motif</p>
                <p className="text-sm">{detailApt.motif}</p>
              </div>
            )}
            {detailApt.notes && (
              <div className="p-3 rounded-xl bg-slate-50">
                <p className="text-xs text-slate-500 mb-1">Notes</p>
                <p className="text-sm whitespace-pre-wrap">{detailApt.notes}</p>
              </div>
            )}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">Arrivez 10 min avant. Annulez 24h à l'avance en cas d'empêchement.</p>
            </div>
            {(detailApt.status === "pending" || detailApt.status === "confirmed") && (
              <Button onClick={async () => { if (window.confirm("Annuler ce rendez-vous ?")) { try { await api.cancelAppointment(detailApt.id); setAppointments(appointments.map((a) => (a.id === detailApt.id ? { ...a, status: "cancelled" } : a))); setDetailApt(null); } catch (e: any) { alert(e.message); } } }} className="w-full bg-red-600 hover:bg-red-700">
                Annuler ce rendez-vous
              </Button>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
