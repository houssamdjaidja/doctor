import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <section className="relative py-24 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="success" className="mb-4">Légal</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
              Conditions{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                d'Utilisation
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
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2"><FileText className="w-6 h-6 text-emerald-600" /> 1. Acceptation des conditions</h2>
                <p className="text-slate-600 leading-relaxed">
                  En accédant et en utilisant ce site web, vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser ce site.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Services médicaux</h2>
                <p className="text-slate-600 leading-relaxed">
                  Les informations fournies sur ce site sont à titre informatif uniquement et ne remplacent pas une consultation médicale professionnelle. Les rendez-vous pris via la plateforme sont soumis à confirmation par le cabinet.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Utilisation du compte</h2>
                <p className="text-slate-600 leading-relaxed">
                  Vous êtes responsable de la confidentialité de vos identifiants de connexion. Toute activité effectuée depuis votre compte est de votre responsabilité. Vous devez nous informer immédiatement de toute utilisation non autorisée.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">4. Rendez-vous et annulations</h2>
                <p className="text-slate-600 leading-relaxed">
                  Les rendez-vous peuvent être annulés jusqu'à 24 heures à l'avance. Les annulations tardives ou les absences non justifiées peuvent entraîner des restrictions d'accès à la plateforme de réservation en ligne.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Propriété intellectuelle</h2>
                <p className="text-slate-600 leading-relaxed">
                  Tout le contenu présent sur ce site (textes, images, logos) est la propriété exclusive du Dr. Djaidja. Toute reproduction ou distribution sans autorisation est interdite.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">6. Limitation de responsabilité</h2>
                <p className="text-slate-600 leading-relaxed">
                  Le cabinet ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation de ce site ou de l'impossibilité d'y accéder.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">7. Contact</h2>
                <p className="text-slate-600 leading-relaxed">
                  Pour toute question relative à ces conditions, contactez-nous :<br />
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
