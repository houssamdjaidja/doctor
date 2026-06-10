import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Users,
  Award,
  Heart,
  Shield,
  Clock,
  Phone,
  MapPin,
  Star,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const stats = [
  { icon: Users, value: "15,000+", label: "Patients satisfaits" },
  { icon: Award, value: "20+", label: "Annأ©es d'expأ©rience" },
  { icon: Heart, value: "50,000+", label: "Consultations rأ©alisأ©es" },
  { icon: Star, value: "4.9/5", label: "Note moyenne" },
];

const workingHours = [
    { day: "Dimanche", hours: "8h00 - 18h00" },
    { day: "Lundi", hours: "8h00 - 18h00" },
    { day: "Mardi", hours: "8h00 - 18h00" },
    { day: "Mercredi", hours: "8h00 - 18h00" },
    { day: "Jeudi", hours: "8h00 - 18h00" },
    { day: "Vendredi", hours: "Fermأ©" },
    { day: "Samedi", hours: "9h00 - 12h00" },
  ];

export function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-teal-50" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxMGI5ODEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="success" className="mb-6">
                âœ¨ Cabinet moderne & accueillant
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight mb-6">
                Votre santأ©, notre{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  prioritأ© absolue
                </span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
                Le Dr. Djaidja vous accueille dans un cabinet moderne et chaleureux pour vous offrir
                des soins mأ©dicaux de qualitأ©. Prenez rendez-vous en ligne en quelques clics.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <Link to="/appointment">
                  <Button size="lg" className="group">
                    <Calendar className="w-5 h-5" />
                    Prendre Rendez-vous
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  Paiement sأ©curisأ©
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  RDV en 24h
                </div>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-200">
                <img
                  src="/doctor.png"
                  alt="Dr. Djaidja - Mأ©decin Gأ©nأ©raliste"
                  className="w-full h-[500px] object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).src = "https://placehold.co/800x600/10b981/white?text=Dr.+Benali";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
              </div>
              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl shadow-slate-200/50 border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Dr. Djaidja</p>
                    <p className="text-sm text-slate-500">Mأ©decin Gأ©nأ©raliste</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxMGI5ODEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center text-white"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 opacity-80" />
                <p className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</p>
                <p className="text-emerald-100 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Hours Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Working Hours */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="success" className="mb-4">Horaires d'ouverture</Badge>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">
                Quand nous consulter ?
              </h2>
              <Card variant="glass" className="mb-6">
                <div className="space-y-3">
                  {workingHours.map((item) => (
                    <div
                      key={item.day}
                      className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0"
                    >
                      <span className="font-medium text-slate-700">{item.day}</span>
                      <span className={item.hours === "Fermأ©" ? "text-red-500" : "text-slate-600"}>
                        {item.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
              <div className="flex flex-wrap gap-4">
                <a href="tel:+21321234567">
                  <Button>
                    <Phone className="w-4 h-4" />
                    Appeler maintenant
                  </Button>
                </a>
                <Link to="/appointment">
                  <Button variant="secondary">
                    <Calendar className="w-4 h-4" />
                    Prendre RDV
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Map & Contact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="success" className="mb-4">Localisation</Badge>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">
                Oأ¹ nous trouver ?
              </h2>
              <Card variant="glass" className="overflow-hidden p-0">
                <div className="h-64 bg-slate-200 relative">
                  <iframe
                    src="https://www.google.com/maps?q=24%20Rue%20Didouche%20Mourad%2C%20Alger%2C%20Alg%C3%A9rie&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Localisation du cabinet"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-slate-800">Adresse du cabinet</p>
                      <p className="text-slate-600">24 Rue Didouche Mourad, 16000 Alger</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-semibold text-slate-800">Tأ©lأ©phone</p>
                      <a href="tel:+21321234567" className="text-emerald-600 hover:underline">
                        +213 21 23 45 67
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 to-teal-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxMGI5ODEiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Prأھt أ  prendre soin de votre santأ© ?
            </h2>
            <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
              Prenez rendez-vous en ligne en quelques clics. Notre أ©quipe vous accueille dans les meilleures conditions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/appointment">
                <Button
                  size="lg"
                  className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-xl"
                >
                  <Calendar className="w-5 h-5" />
                  Prendre Rendez-vous
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  Nous contacter
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}