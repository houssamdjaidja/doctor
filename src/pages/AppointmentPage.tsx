/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { api } from "@/lib/api";

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30",
];

const motifs = [
  "Consultation générale",
  "Suivi médical",
  "Vaccination",
  "Contrôle de santé",
  "Renouvellement ordonnance",
  "Autre",
];

const isLettersOnly = (str: string) => /^[A-Za-zÀ-ÿ\s\-']+$/.test(str);
const isPhoneValid = (phone: string) => /^\d{10,11}$/.test(phone);

export function AppointmentPage() {
  const navigate = useNavigate();
  const isPatientLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (!isPatientLoggedIn) navigate("/patient/login", { replace: true });
  }, []);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    motif: "",
    notes: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date;
  });

  const fetchAvailableSlots = async (dateStr: string, dateValue: string) => {
    setLoadingSlots(true);
    setSelectedTime(null);
    try {
      const res = await api.getAvailableSlots(dateStr);
      setAvailableSlots(res.available);
    } catch {
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const validateStep2 = () => {
    let isValid = true;
    const newErrors = { firstName: "", lastName: "", phone: "" };
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
      isValid = false;
    } else if (!isLettersOnly(formData.firstName)) {
      newErrors.firstName = "Le prénom ne doit contenir que des lettres";
      isValid = false;
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
      isValid = false;
    } else if (!isLettersOnly(formData.lastName)) {
      newErrors.lastName = "Le nom ne doit contenir que des lettres";
      isValid = false;
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Le téléphone est requis";
      isValid = false;
    } else if (!isPhoneValid(formData.phone)) {
      newErrors.phone = "Le téléphone doit contenir 10 ou 11 chiffres";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleContinueToStep3 = () => {
    if (validateStep2()) setStep(3);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.createAppointment({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        date: selectedDate,
        timeSlot: selectedTime,
        motif: formData.motif,
        notes: formData.notes,
      });
      if (isPatientLoggedIn) {
        navigate("/patient/dashboard");
      } else {
        setSubmitted(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card variant="elevated" className="text-center py-12">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Rendez-vous confirmé !
            </h2>
            <p className="text-slate-600 mb-6">
              Votre rendez-vous a été enregistré avec succès. Vous recevrez un email de confirmation
              avec tous les détails.
            </p>
            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span className="font-medium">{selectedDate}</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>{selectedTime}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>Cabinet médical</span>
              </div>
            </div>
            <Button onClick={() => { setSubmitted(false); setStep(1); setSelectedDate(null); setSelectedTime(null); setFormData({ firstName: "", lastName: "", phone: "", email: "", motif: "", notes: "" }); }} className="w-full">
              Prendre un autre rendez-vous
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="relative py-16 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => navigate(-1)} className="absolute top-6 left-6 p-3 sm:p-2 rounded-xl hover:bg-white/60 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <Badge variant="success" className="mb-4">Rendez-vous</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Prenez{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                rendez-vous
              </span>
            </h1>
            <p className="text-lg text-slate-600 max-w-xl mx-auto">
              Réservez votre consultation en quelques clics. Choisissez la date, l'heure et le motif de consultation.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${step >= s ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                {step > s ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < 3 && <div className={`w-24 md:w-40 h-1 mx-2 rounded transition-all duration-300 ${step > s ? "bg-emerald-600" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card variant="glass" className="mb-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" /> Choisissez une date
              </h2>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
                {dates.map((date) => {
                  const dateStr = date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
                  const isWeekend = date.getDay() === 5;
                  const dateValue = date.toISOString().split("T")[0];
                  return (
                    <button key={dateValue} onClick={() => { if (!isWeekend) { setSelectedDate(dateStr); fetchAvailableSlots(dateStr, dateValue); } }} disabled={isWeekend}
                      className={`p-3 rounded-xl text-center transition-all duration-200 ${isWeekend ? "bg-slate-100 text-slate-400 cursor-not-allowed" : selectedDate === dateStr ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50"}`}>
                      <div className="text-xs font-medium">{date.toLocaleDateString("fr-FR", { weekday: "short" })}</div>
                      <div className="text-lg font-bold">{date.getDate()}</div>
                    </button>
                  );
                })}
              </div>
            </Card>
            <Card variant="glass" className="mb-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" /> Choisissez une heure
              </h2>
              {!selectedDate ? (
                <p className="text-slate-400 text-center py-4">Sélectionnez d'abord une date</p>
              ) : loadingSlots ? (
                <p className="text-slate-400 text-center py-4">Chargement des créneaux...</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-8 gap-2 md:gap-3">
                  {timeSlots.map((time) => {
                    const isAvailable = availableSlots.includes(time);
                    return (
                      <button key={time} onClick={() => isAvailable && setSelectedTime(time)} disabled={!isAvailable}
                        className={`p-3 rounded-xl text-center font-medium transition-all duration-200 ${selectedTime === time ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : isAvailable ? "bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50" : "bg-slate-100 text-slate-400 line-through cursor-not-allowed"}`}>
                        {time}
                      </button>
                    );
                  })}
                </div>
              )}
            </Card>
            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!selectedDate || !selectedTime}>
                Continuer <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card variant="glass">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-600" /> Vos informations
              </h2>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Prénom *</label>
                    <Input placeholder="Votre prénom" value={formData.firstName}
                      onChange={(e) => { setFormData({ ...formData, firstName: e.target.value }); if (errors.firstName) setErrors({ ...errors, firstName: "" }); }}
                      className={errors.firstName ? "border-red-500" : ""} />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom *</label>
                    <Input placeholder="Votre nom" value={formData.lastName}
                      onChange={(e) => { setFormData({ ...formData, lastName: e.target.value }); if (errors.lastName) setErrors({ ...errors, lastName: "" }); }}
                      className={errors.lastName ? "border-red-500" : ""} />
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone *</label>
                    <Input type="tel" placeholder="06 12 34 56 78" value={formData.phone}
                      onChange={(e) => { setFormData({ ...formData, phone: e.target.value }); if (errors.phone) setErrors({ ...errors, phone: "" }); }}
                      className={errors.phone ? "border-red-500" : ""} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email <span className="text-slate-400 text-xs">(optionnel)</span></label>
                    <Input type="email" placeholder="votre@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Motif de consultation</label>
                  <select className="flex h-12 w-full rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400"
                    value={formData.motif} onChange={(e) => setFormData({ ...formData, motif: e.target.value })}>
                    <option value="">-- Sélectionnez ou laissez vide --</option>
                    {motifs.map((motif) => <option key={motif} value={motif}>{motif}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Notes complémentaires</label>
                  <Textarea placeholder="Décrivez brièvement vos symptômes ou questions..." value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
                </div>
              </form>
            </Card>
            <div className="flex justify-between mt-6">
              <Button variant="secondary" onClick={() => setStep(1)}><ChevronLeft className="w-4 h-4" /> Retour</Button>
              <Button onClick={handleContinueToStep3}>Continuer <ChevronRight className="w-4 h-4" /></Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card variant="glass">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" /> Récapitulatif
              </h2>
              <div className="space-y-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-medium text-slate-800 mb-3">Détails du rendez-vous</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4 text-emerald-600" /><span>{selectedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4 text-emerald-600" /><span>{selectedTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 md:col-span-2">
                      <MapPin className="w-4 h-4 text-emerald-600" /><span>Cabinet médical - 24 Rue Didouche Mourad, 16000 Alger</span>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-medium text-slate-800 mb-3">Vos informations</h3>
                  <div className="grid md:grid-cols-2 gap-2 text-sm text-slate-600">
                    <p><strong>Nom:</strong> {formData.firstName} {formData.lastName}</p>
                    <p><strong>Téléphone:</strong> {formData.phone}</p>
                    {formData.email && <p><strong>Email:</strong> {formData.email}</p>}
                    {formData.motif && <p><strong>Motif:</strong> {formData.motif}</p>}
                  </div>
                  {formData.notes && <p className="mt-2 text-sm text-slate-600"><strong>Notes:</strong> {formData.notes}</p>}
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-emerald-800">
                    <p className="font-medium mb-1">Important</p>
                    <p>En confirmant ce rendez-vous, vous acceptez notre politique d'annulation. Merci d'arriver 10 minutes avant l'heure prévue.</p>
                  </div>
                </div>
              </div>
            </Card>
            <div className="flex justify-between mt-6">
              <Button variant="secondary" onClick={() => setStep(2)}><ChevronLeft className="w-4 h-4" /> Modifier</Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                <CheckCircle className="w-4 h-4" />
                {submitting ? "En cours..." : "Confirmer le rendez-vous"}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
