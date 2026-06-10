import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Calendar,
  Clock,
  CreditCard,
  Phone,
  HelpCircle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";

const faqCategories = [
  { id: "appointments", name: "Rendez-vous", icon: Calendar },
  { id: "practical", name: "Pratique", icon: Clock },
  { id: "payment", name: "Paiement", icon: CreditCard },
];

const faqData = [
  {
    category: "appointments",
    questions: [
      {
        question: "Comment prendre rendez-vous ?",
        answer: "Vous pouvez prendre rendez-vous de plusieurs faأ§ons : en ligne via notre formulaire de prise de rendez-vous, par tأ©lأ©phone au +213 21 23 45 67, ou directement au cabinet. La prise de rendez-vous en ligne est disponible 24h/24.",
      },
      {
        question: "Quels sont les dأ©lais pour obtenir un rendez-vous ?",
        answer: "Nous nous efforأ§ons de vous proposer un rendez-vous dans les meilleurs dأ©lais. En gأ©nأ©ral, un rendez-vous est disponible sous 24 أ  48 heures pour les consultations non urgentes. Pour les urgences, contactez-nous par tأ©lأ©phone.",
      },
      {
        question: "Puis-je modifier ou annuler mon rendez-vous ?",
        answer: "Oui, vous pouvez modifier ou annuler votre rendez-vous jusqu'أ  24 heures avant l'heure prأ©vue sans frais. Au-delأ , une indemnitأ© pourra أھtre demandأ©e. Vous pouvez le faire en ligne depuis votre espace patient ou par tأ©lأ©phone.",
      },
      {
        question: "Dois-je arriver en avance pour mon rendez-vous ?",
        answer: "Oui, nous vous recommandons d'arriver 10 أ  15 minutes avant votre rendez-vous pour complأ©ter les formalitأ©s administratives si nأ©cessaire, surtout si c'est votre premiأ¨re consultation.",
      },
    ],
  },
  {
    category: "practical",
    questions: [
      {
        question: "Quels sont les horaires d'ouverture du cabinet ?",
        answer: "Le cabinet est ouvert du dimanche au jeudi de 8h00 أ  18h00, et le samedi de 9h00 أ  12h00. Nous sommes fermأ©s le vendredi et les jours fأ©riأ©s.",
      },
      {
        question: "Quels documents dois-je apporter pour ma consultation ?",
        answer: "Pensez أ  apporter votre carte Chifa, votre carte de complأ©mentaire santأ© (si vous en avez une), une piأ¨ce d'identitأ©, et tous les documents mأ©dicaux pertinents (rأ©sultats d'analyses, ordonnances, comptes-rendus d'examens...).",
      },
      {
        question: "Comment accأ©der au cabinet ?",
        answer: "Le cabinet est situأ© au 24 Rue Didouche Mourad, 16000 Alger. Il est accessible en mأ©tro, tramway, bus et taxi. Le cabinet est accessible aux personnes أ  mobilitأ© rأ©duite.",
      },
      {
        question: "Y a-t-il un parking أ  proximitأ© ?",
        answer: "Oui, un parking public se trouve أ  2 minutes أ  pied du cabinet. Il est payant. Nous recommandons les transports en commun pour faciliter votre accأ¨s.",
      },
    ],
  },
  {
    category: "payment",
    questions: [
      {
        question: "Quels moyens de paiement sont acceptأ©s ?",
        answer: "Nous acceptons les paiements par carte bancaire, chأ¨que, espأ¨ces et virement. Le paiement sans contact est disponible. Nous n'acceptons pas les paiements en plusieurs fois.",
      },
      {
        question: "Acceptez-vous la carte Chifa et les complأ©mentaires santأ© ?",
        answer: "Oui, nous acceptons la carte Chifa et les cartes de complأ©mentaire santأ© pour le tiers payant. Vous ne payez que la part non remboursأ©e. Pensez أ  mettre أ  jour votre carte Chifa rأ©guliأ¨rement.",
      },
      {
        question: "Quels sont les tarifs des consultations ?",
        answer: "Les tarifs varient selon le type de consultation : 2 500 DA pour une consultation gأ©nأ©rale, 3 000 DA pour un suivi, 5 000 DA pour un bilan de santأ© complet. Ces tarifs sont conformes aux conventions et sont partiellement remboursأ©s par la CNAS.",
      },
      {
        question: "Proposez-vous des facilitأ©s de paiement ?",
        answer: "Pour les patients en difficultأ© financiأ¨re, nous pouvons أ©tudier des solutions de paiement adaptأ©es. N'hأ©sitez pas أ  en parler lors de votre consultation. Nous acceptons أ©galement les dispositifs sociaux disponibles.",
      },
    ],
  },
];

export function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("appointments");
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const currentCategory = faqData.find((cat) => cat.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="success" className="mb-4">FAQ</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Questions{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Frأ©quentes
              </span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Retrouvez les rأ©ponses aux questions les plus courantes. Si vous ne trouvez pas votre rأ©ponse, n'hأ©sitez pas أ  nous contacter.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setOpenQuestion(null);
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
                }`}
              >
                <cat.icon className="w-5 h-5" />
                {cat.name}
              </button>
            ))}
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {currentCategory?.questions.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  variant="glass"
                  hover={false}
                  className="cursor-pointer"
                  onClick={() => setOpenQuestion(openQuestion === `${selectedCategory}-${index}` ? null : `${selectedCategory}-${index}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <HelpCircle className="w-4 h-4 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-slate-800">{item.question}</h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                        openQuestion === `${selectedCategory}-${index}` ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  <AnimatePresence>
                    {openQuestion === `${selectedCategory}-${index}` && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-slate-600 mt-4 pl-11">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <Card variant="elevated" className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                Vous n'avez pas trouvأ© votre rأ©ponse ?
              </h3>
              <p className="text-slate-600 mb-6">
                Notre أ©quipe est disponible pour rأ©pondre أ  toutes vos questions.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/contact">
                  <Button>
                    Nous contacter
                  </Button>
                </Link>
                <a href="tel:+21321234567">
                  <Button variant="secondary">
                    <Phone className="w-4 h-4" />
                    +213 21 23 45 67
                  </Button>
                </a>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}