import { motion } from "framer-motion";
import {
  Award,
  GraduationCap,
  Briefcase,
  Globe,
  Heart,
  Users,
  Calendar,
  CheckCircle,
  Stethoscope,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";

const education = [
  {
    year: "2000",
    title: "Doctorat en Médecine",
    institution: "Université d'Alger 1",
  },
  {
    year: "2002",
    title: "Spécialisation en Médecine Générale",
    institution: "CHU Mustapha Pacha, Alger",
  },
  {
    year: "2005",
    title: "Diplôme en Santé Publique",
    institution: "Institut National de Santé Publique",
  },
  {
    year: "2010",
    title: "Formation en Télémédecine",
    institution: "Université d'Oran 1 Ahmed Ben Bella",
  },
];

const certifications = [
  "Conseil Régional de l'Ordre des Médecins d'Alger",
  "Diplôme de Médecine Générale",
  "Formation continue agréée par les autorités sanitaires algériennes",
  "Formation continue accréditée",
  "Conventionnement CNAS/CASNOS",
];

const experience = [
  {
    period: "2015 - Présent",
    role: "Médecin Généraliste",
    location: "Cabinet médical privé, Alger",
    description: "Consultations, suivi des patients chroniques, prévention et éducation thérapeutique.",
  },
  {
    period: "2008 - 2015",
    role: "Médecin Attaché",
    location: "CHU Mustapha Pacha, Alger",
    description: "Service de médecine interne, urgences et consultations spécialisées.",
  },
  {
    period: "2002 - 2008",
    role: "Médecin Généraliste",
    location: "Centre de santé, Blida",
    description: "Médecine de ville, suivi de patients poly-pathologiques.",
  },
];

const languages = [
  { name: "Français", level: "Natif" },
  { name: "Anglais", level: "Intermédiaire" },
  { name: "Arabe", level: "Natif" },
];

const associations = [
  "Société Algérienne de Médecine Générale",
  "Association des Médecins Généralistes d'Alger",
  "Collège Algérien de Médecine Générale",
  "Réseau de Santé Alger Centre",
];

const values = [
  {
    icon: Heart,
    title: "Bienveillance",
    description: "Écoute attentive et prise en charge personnalisée de chaque patient.",
  },
  {
    icon: Users,
    title: "Proximité",
    description: "Disponibilité et accessibilité pour tous vos besoins de santé.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Formation continue et pratiques basées sur les dernières recommandations.",
  },
  {
    icon: Stethoscope,
    title: "Éthique",
    description: "Respect du secret médical et des principes déontologiques.",
  },
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="success" className="mb-4">À Propos</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                Dr. Amine{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Benali
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-4">Médecin Généraliste</p>
              <p className="text-slate-600 leading-relaxed mb-8">
                Fort de plus de 20 ans d'expérience, je m'engage à offrir des soins médicaux de qualité,
                alliant expertise scientifique et approche humaine. Ma priorité : votre santé et votre bien-être.
              </p>
              <div className="flex gap-4">
                <Link to="/appointment">
                  <Button>
                    <Calendar className="w-4 h-4" />
                    Prendre RDV
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="secondary">Me contacter</Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-emerald-200">
                <img
                  src="/doctor.png"
                  alt="Dr. Amine Benali"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              {/* Stats Overlay */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl p-4 shadow-xl shadow-slate-200/50 border border-slate-100 flex gap-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">20+</p>
                  <p className="text-xs text-slate-500">Années</p>
                </div>
                <div className="text-center border-l border-slate-100 px-4">
                  <p className="text-2xl font-bold text-emerald-600">15K+</p>
                  <p className="text-xs text-slate-500">Patients</p>
                </div>
                <div className="text-center border-l border-slate-100 px-4">
                  <p className="text-2xl font-bold text-emerald-600">4.9</p>
                  <p className="text-xs text-slate-500">Note</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="success" className="mb-4">Mes Valeurs</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Une médecine centrée sur le patient
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className="text-center h-full">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{value.title}</h3>
                  <p className="text-slate-600 text-sm">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Education & Experience */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Education */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Formation Académique</h2>
              </div>
              <div className="space-y-4">
                {education.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-8 pb-6 border-l-2 border-emerald-200 last:pb-0"
                  >
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-emerald-500" />
                    <span className="text-sm text-emerald-600 font-medium">{item.year}</span>
                    <h3 className="font-semibold text-slate-800 mt-1">{item.title}</h3>
                    <p className="text-slate-500 text-sm">{item.institution}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Expérience Professionnelle</h2>
              </div>
              <div className="space-y-6">
                {experience.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card variant="glass">
                      <span className="text-sm text-emerald-600 font-medium">{item.period}</span>
                      <h3 className="font-semibold text-slate-800 mt-1">{item.role}</h3>
                      <p className="text-slate-500 text-sm mb-2">{item.location}</p>
                      <p className="text-slate-600 text-sm">{item.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Certifications & Languages */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <Card variant="elevated">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-xl font-bold text-slate-800">Diplômes & Certifications</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-center gap-2 text-slate-600">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Languages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="elevated">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-xl font-bold text-slate-800">Langues Parlées</h2>
                </div>
                <div className="space-y-3">
                  {languages.map((lang, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-slate-700">{lang.name}</span>
                      <Badge variant={lang.level === "Natif" ? "success" : "default"}>
                        {lang.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Associations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <Card variant="glass">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-bold text-slate-800">Associations Médicales</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {associations.map((assoc, index) => (
                  <Badge key={index} variant="info">
                    {assoc}
                  </Badge>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}