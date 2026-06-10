import { motion } from "framer-motion";
import {
  Phone,
  AlertTriangle,
  Ambulance,
  Heart,
  Shield,
  CheckCircle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const emergencyNumbers = [
  {
    number: "15",
    name: "SAMU",
    description: "Urgences médicales graves",
    icon: Ambulance,
    color: "red",
  },
  {
    number: "18",
    name: "Pompiers",
    description: "Incendies, accidents, urgences",
    icon: Shield,
    color: "orange",
  },
  {
    number: "112",
    name: "Urgences Europe",
    description: "Numéro d'urgence européen",
    icon: Phone,
    color: "blue",
  },
  {
    number: "114",
    name: "Urgences Sourds",
    description: "Pour les personnes sourdes/malentendantes",
    icon: Heart,
    color: "purple",
  },
];

const procedures = [
  {
    title: "En cas d'urgence vitale",
    steps: [
      "Appelez immédiatement le 15 (SAMU) ou le 112",
      "Décrivez précisément la situation et la localisation",
      "Ne raccrochez pas avant que l'opérateur vous le demande",
      "Suivez les instructions données par les secours",
      "Si possible, envoyez quelqu'un attendre les secours",
    ],
  },
  {
    title: "En cas de malaise léger",
    steps: [
      "Asseyez-vous ou allongez-vous dans un endroit calme",
      "Buvez de l'eau si possible",
      "Appelez notre cabinet pour un conseil médical",
      "Si les symptômes persistent, consultez un médecin",
      "En cas de doute, n'hésitez pas à appeler le 15",
    ],
  },
  {
    title: "En cas d'accident domestique",
    steps: [
      "Sécurisez les lieux pour éviter tout suraccident",
      "Évaluez l'état de la victime (conscience, respiration)",
      "Appelez les secours si nécessaire (15 ou 112)",
      "Pratiquez les premiers gestes si vous êtes formé",
      "Attendez les secours en restant auprès de la victime",
    ],
  },
];

const importantInfo = [
  "Gardez votre dossier médical à jour et accessible",
  "Notez vos allergies et traitements en cours",
  "Ayez toujours une carte vitale sur vous",
  "Programmez les numéros d'urgence dans votre téléphone",
  "Connaître l'adresse exacte de votre domicile",
];

export function EmergencyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-red-600 to-rose-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Urgences Médicales
            </h1>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              En cas d'urgence, agissez rapidement. Voici les numéros à connaître et les procédures à suivre.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Emergency Numbers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="warning" className="mb-4">Numéros d'urgence</Badge>
            <h2 className="text-3xl font-bold text-slate-800">
              Appelez immédiatement en cas d'urgence
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyNumbers.map((item, index) => (
              <motion.a
                key={item.number}
                href={`tel:${item.number}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  variant="elevated"
                  className="text-center h-full hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform ${
                      item.color === "red"
                        ? "bg-red-100"
                        : item.color === "orange"
                        ? "bg-orange-100"
                        : item.color === "blue"
                        ? "bg-blue-100"
                        : "bg-purple-100"
                    }`}
                  >
                    <item.icon
                      className={`w-8 h-8 ${
                        item.color === "red"
                          ? "text-red-600"
                          : item.color === "orange"
                          ? "text-orange-600"
                          : item.color === "blue"
                          ? "text-blue-600"
                          : "text-purple-600"
                      }`}
                    />
                  </div>
                  <p
                    className={`text-4xl font-bold mb-2 ${
                      item.color === "red"
                        ? "text-red-600"
                        : item.color === "orange"
                        ? "text-orange-600"
                        : item.color === "blue"
                        ? "text-blue-600"
                        : "text-purple-600"
                    }`}
                  >
                    {item.number}
                  </p>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">{item.name}</h3>
                  <p className="text-slate-500 text-sm">{item.description}</p>
                </Card>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Procedures */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="info" className="mb-4">Procédures</Badge>
            <h2 className="text-3xl font-bold text-slate-800">
              Que faire en cas d'urgence ?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {procedures.map((procedure, index) => (
              <motion.div
                key={procedure.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className="h-full">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    {procedure.title}
                  </h3>
                  <ol className="space-y-3">
                    {procedure.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 text-xs font-semibold">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Info */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card variant="elevated">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800">
                  Informations importantes pour les patients
                </h2>
              </div>
              <ul className="space-y-3">
                {importantInfo.map((info, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-600">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {info}
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-4">
              Besoin de nous joindre rapidement ?
            </h2>
            <p className="text-slate-400 mb-6">
              Pour les urgences non vitales, vous pouvez nous contacter pendant nos heures d'ouverture.
            </p>
            <a href="tel:+21321234567">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <Phone className="w-5 h-5" />
                +213 21 23 45 67
              </Button>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}