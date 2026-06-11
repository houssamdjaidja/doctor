import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="relative py-24 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="success" className="mb-4">Légal</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Politique de{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Confidentialité
              </span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Dernière mise à jour : Juin 2026
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="prose prose-slate max-w-none">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Shield className="w-6 h-6 text-emerald-600" /> 1. Collecte des informations</h2>
                <p className="text-slate-600 leading-relaxed">
                  Nous collectons les informations suivantes lorsque vous utilisez notre site :
                </p>
                <ul className="list-disc pl-6 mt-2 text-slate-600 space-y-1">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone</li>
                  <li>Informations médicales que vous fournissez volontairement</li>
                  <li>Données de connexion (adresse IP, navigateur)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Utilisation des données</h2>
                <p className="text-slate-600 leading-relaxed">
                  Vos données sont utilisées uniquement pour :
                </p>
                <ul className="list-disc pl-6 mt-2 text-slate-600 space-y-1">
                  <li>La gestion des rendez-vous médicaux</li>
                  <li>La communication liée aux soins</li>
                  <li>L'amélioration de nos services</li>
                  <li>Le respect des obligations légales</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Protection des données</h2>
                <p className="text-slate-600 leading-relaxed">
                  Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données personnelles contre tout accès non autorisé, modification, divulgation ou destruction.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Partage des données</h2>
                <p className="text-slate-600 leading-relaxed">
                  Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées uniquement :
                </p>
                <ul className="list-disc pl-6 mt-2 text-slate-600 space-y-1">
                  <li>Avec votre consentement explicite</li>
                  <li>Pour respecter une obligation légale</li>
                  <li>Avec des prestataires de services de confiance (hébergement, email)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Vos droits</h2>
                <p className="text-slate-600 leading-relaxed">
                  Conformément à la réglementation applicable, vous disposez des droits suivants :
                </p>
                <ul className="list-disc pl-6 mt-2 text-slate-600 space-y-1">
                  <li>Droit d'accès à vos données</li>
                  <li>Droit de rectification</li>
                  <li>Droit à l'effacement</li>
                  <li>Droit à la limitation du traitement</li>
                  <li>Droit à la portabilité des données</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">6. Contact</h2>
                <p className="text-slate-600 leading-relaxed">
                  Pour toute question concernant cette politique, contactez-nous à :<br />
                  <strong>Email :</strong> contact@dr-djaidja.dz<br />
                  <strong>Téléphone :</strong> +213 21 23 45 67
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
