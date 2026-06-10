/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { api } from "@/lib/api";

const contactInfo = [
  {
    icon: Phone,
    title: "Téléphone",
    content: "+213 21 23 45 67",
    link: "tel:+21321234567",
    description: "Dim-Jeu: 8h-18h, Sam: 9h-12h",
  },
  {
    icon: Mail,
    title: "Email",
    content: "contact@dr-djaidja.dz",
    link: "mailto:contact@dr-djaidja.dz",
    description: "Réponse sous 24h",
  },
  {
    icon: MapPin,
    title: "Adresse",
    content: "24 Rue Didouche Mourad, 16000 Alger",
    link: "https://maps.google.com/?q=24+Rue+Didouche+Mourad+Alger+Algerie",
    description: "Alger Centre, proche métro et tramway",
  },
];

const workingHours = [
    { day: "Dimanche", hours: "8h00 - 18h00" },
    { day: "Lundi", hours: "8h00 - 18h00" },
    { day: "Mardi", hours: "8h00 - 18h00" },
    { day: "Mercredi", hours: "8h00 - 18h00" },
    { day: "Jeudi", hours: "8h00 - 18h00" },
    { day: "Vendredi", hours: "Fermé" },
    { day: "Samedi", hours: "9h00 - 12h00" },
  ];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.sendContact(formData);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="relative py-24 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="success" className="mb-4">Contact</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Nous <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Contacter</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Une question ? Besoin d'informations ? Notre équipe est à votre disposition pour vous répondre.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div key={info.title} initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                  <Card variant="glass" className="group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 mb-1">{info.title}</h3>
                        <a href={info.link} className="text-emerald-600 hover:text-emerald-700 font-medium">{info.content}</a>
                        <p className="text-slate-500 text-sm mt-1">{info.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.3 }}>
                <Card variant="glass">
                  <h3 className="font-semibold text-slate-800 mb-4">Suivez-nous</h3>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <a key={social.label} href={social.href} aria-label={social.label}
                        className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-emerald-600 hover:text-white text-slate-600 transition-all duration-200">
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.4 }}>
                <Card variant="glass">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-semibold text-slate-800">Horaires d'ouverture</h3>
                  </div>
                  <div className="space-y-2">
                    {workingHours.map((item) => (
                      <div key={item.day} className="flex justify-between text-sm">
                        <span className="text-slate-600">{item.day}</span>
                        <span className={item.hours === "Fermé" ? "text-red-500" : "text-slate-800 font-medium"}>{item.hours}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} className="lg:col-span-2">
              {submitted ? (
                <Card variant="elevated" className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">Message envoyé !</h2>
                  <p className="text-slate-600 mb-6">Merci pour votre message. Nous vous répondrons dans les plus brefs délais.</p>
                  <Button onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", phone: "", subject: "", message: "" }); }}>
                    Envoyer un autre message
                  </Button>
                </Card>
              ) : (
                <Card variant="elevated">
                  <div className="flex items-center gap-3 mb-6">
                    <MessageCircle className="w-6 h-6 text-emerald-600" />
                    <h2 className="text-xl font-semibold text-slate-800">Envoyez-nous un message</h2>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nom complet *</label>
                        <Input placeholder="Votre nom" value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                        <Input type="email" placeholder="votre@email.com" value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                        <Input type="tel" placeholder="06 12 34 56 78" value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Sujet *</label>
                        <select className="flex h-12 w-full rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400"
                          value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required>
                          <option value="">Sélectionnez un sujet</option>
                          <option value="appointment">Prise de rendez-vous</option>
                          <option value="information">Demande d'information</option>
                          <option value="billing">Question sur la facturation</option>
                          <option value="other">Autre</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Message *</label>
                      <Textarea placeholder="Votre message..." value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="min-h-[150px]" required />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" className="w-full md:w-auto" disabled={submitting}>
                      <Send className="w-4 h-4" />{submitting ? "Envoi..." : "Envoyer le message"}
                    </Button>
                  </form>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-8">
            <Badge variant="success" className="mb-4">Localisation</Badge>
            <h2 className="text-2xl font-bold text-slate-800">Où nous trouver ?</h2>
          </motion.div>
          <Card variant="glass" className="overflow-hidden p-0">
            <div className="h-96">
              <iframe src="https://www.google.com/maps?q=24%20Rue%20Didouche%20Mourad%2C%20Alger%2C%20Alg%C3%A9rie&output=embed"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                title="Localisation du cabinet" />
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
