import { Link } from "react-router-dom"
import {
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Heart,
} from "lucide-react"

const quickLinks = [
  { name: "Accueil", href: "/" },
  { name: "À Propos", href: "/about" },
  { name: "Rendez-vous", href: "/appointment" },
  { name: "Blog Santé", href: "/blog" },
  { name: "Contact", href: "/contact" },
]

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
]

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* About */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">Dr. Benali</span>
                <p className="text-xs text-slate-400">Médecin Généraliste</p>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Votre santé est notre priorité. Nous offrons des soins médicaux de qualité
              dans un environnement chaleureux et professionnel.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-emerald-600 transition-colors duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Liens Rapides</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-emerald-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-400 text-sm">
                  24 Rue Didouche Mourad<br />
                  16000 Alger, Algérie
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400" />
                <a href="tel:+21321234567" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                  +213 21 23 45 67
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-400" />
                <a href="mailto:contact@dr-benali.dz" className="text-slate-400 text-sm hover:text-emerald-400 transition-colors">
                  contact@dr-benali.dz
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-400 text-sm">
                  Lun - Ven: 8h - 18h<br />
                  Samedi: 9h - 12h
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm flex items-center gap-1">
              © 2024 Dr. Benali. Tous droits réservés. Fait avec{" "}
              <Heart className="w-4 h-4 text-red-500 fill-current" /> pour vos soins.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-slate-400 hover:text-emerald-400 transition-colors">
                Politique de confidentialité
              </Link>
              <Link to="/terms" className="text-slate-400 hover:text-emerald-400 transition-colors">
                Conditions d'utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}