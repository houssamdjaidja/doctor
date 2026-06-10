import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import {
  Stethoscope,
  UserCheck,
  Syringe,
  ClipboardCheck,
  Activity,
  Heart,
  Pill,
  Baby,
  Calendar,
  ArrowRight,
  CheckCircle,
  Clock,
  Euro,
} from "lucide-react"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"

const services = [
  {
    icon: Stethoscope,
    title: "Consultation Gأ©nأ©rale",
    description: "Examen mأ©dical complet incluant l'anamnأ¨se, l'examen clinique et le diagnostic. Nous traitons tous types de problأ¨mes de santأ© courants.",
    duration: "30 min",
    price: "2500 DA",
    features: [
      "Examen clinique complet",
      "Diagnostic personnalisأ©",
      "Ordonnance si nأ©cessaire",
      "Conseils de prأ©vention",
    ],
    image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=300&fit=crop",
  },
  {
    icon: UserCheck,
    title: "Suivi Mأ©dical",
    description: "Accompagnement rأ©gulier pour les patients nأ©cessitant un suivi mأ©dical continu. Idأ©al pour les maladies chroniques.",
    duration: "45 min",
    price: "3000 DA",
    features: [
      "Suivi personnalisأ©",
      "Ajustement des traitements",
      "Examens rأ©guliers",
      "Coordination avec spأ©cialistes",
    ],
    image: "https://images.unsplash.com/photo-157609116055073dba999ef?w=400&h=300&fit=crop",
  },
  {
    icon: Syringe,
    title: "Vaccination",
    description: "Service de vaccination complet pour adultes et enfants. Tous les vaccins du calendrier vaccinal sont disponibles.",
    duration: "15 min",
    price: "Gratuit*",
    features: [
      "Vaccins obligatoires",
      "Vaccins recommandأ©s",
      "Carnet de vaccination",
      "Rappels automatiques",
    ],
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=300&fit=crop",
  },
  {
    icon: ClipboardCheck,
    title: "Contrأ´le de Santأ©",
    description: "Bilan de santأ© complet incluant les examens de routine et les dأ©pistages recommandأ©s selon votre أ¢ge et antأ©cأ©dents.",
    duration: "60 min",
    price: "5000 DA",
    features: [
      "Bilan complet",
      "Analyses sanguines",
      "Dأ©pistages ciblأ©s",
      "Rapport dأ©taillأ©",
    ],
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508?w=400&h=300&fit=crop",
  },
  {
    icon: Activity,
    title: "Examens Prأ©ventifs",
    description: "Dأ©pistages et examens de prأ©vention pour dأ©tecter prأ©cocement les maladies et rester en bonne santأ©.",
    duration: "45 min",
    price: "3500 DA",
    features: [
      "Dأ©pistage cancer",
      "Bilan cardiovasculaire",
      "Examens selon أ¢ge",
      "Conseils personnalisأ©s",
    ],
    image: "https://images.unsplash.com/photo-1559757175-0eb30c063?w=400&h=300&fit=crop",
  },
  {
    icon: Heart,
    title: "Gestion Maladies Chroniques",
    description: "Prise en charge complأ¨te des maladies chroniques : diabأ¨te, hypertension, asthme, etc.",
    duration: "45 min",
    price: "3000 DA",
    features: [
      "Suivi rأ©gulier",
      "أ‰ducation thأ©rapeutique",
      "Coordination spأ©cialistes",
      "Plan de soins personnalisأ©",
    ],
    image: "https://images.unsplash.com/photo-1501172876-fa1923c5c528?w=400&h=300&fit=crop",
  },
  {
    icon: Pill,
    title: "Conseils Mأ©dicamenteux",
    description: "Revue de vos traitements, conseils sur les mأ©dicaments et optimisation de votre pharmacothأ©rapie.",
    duration: "20 min",
    price: "2000 DA",
    features: [
      "Revue mأ©dicamenteuse",
      "Interactions mأ©dicamenteuses",
      "Optimisation traitement",
      "Conseils personnalisأ©s",
    ],
    image: "https://images.unsplash.com/photo-1584306744-24d5c474f2ae?w=400&h=300&fit=crop",
  },
  {
    icon: Baby,
    title: "Pأ©diatrie",
    description: "Soins mأ©dicaux pour les enfants de 0 أ  16 ans : consultations, vaccinations, suivi de croissance.",
    duration: "30 min",
    price: "2500 DA",
    features: [
      "Consultations enfant",
      "Suivi croissance",
      "Vaccinations",
      "Certificats mأ©dicaux",
    ],
    image: "https://images.unsplash.com/photo-1631898039984-fd5e658e12c9?w=400&h=300&fit=crop",
  },
]

export function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="success" className="mb-4">Nos Services</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Des soins mأ©dicaux{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                complets
              </span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Nous offrons une large gamme de services mأ©dicaux pour rأ©pondre أ  tous vos besoins de santأ©,
              du diagnostic أ  la prأ©vention.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className="h-full overflow-hidden group">
                  {/* Image */}
                  <div className="relative h-48 -mx-6 -mt-6 mb-6 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center">
                        <service.icon className="w-6 h-6 text-emerald-600" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{service.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{service.description}</p>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {service.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Euro className="w-4 h-4" />
                        {service.price}
                      </span>
                    </div>
                    <Link to="/appointment">
                      <Button size="sm" variant="ghost">
                        Rأ©server
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Besoin d'une consultation ?
            </h2>
            <p className="text-emerald-100 mb-8">
              Prenez rendez-vous en ligne en quelques clics. Notre أ©quipe vous accueille du lundi au samedi.
            </p>
            <Link to="/appointment">
              <Button
                size="lg"
                className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-xl"
              >
                <Calendar className="w-5 h-5" />
                Prendre Rendez-vous
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Pricing Note */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            * Les prix indiquأ©s sont des tarifs de base. Ils peuvent varier selon les cas et sont partiellement
            remboursأ©s par la CNAS. Les vaccinations obligatoires sont gratuites.
          </p>
        </div>
      </section>
    </div>
  )
}
