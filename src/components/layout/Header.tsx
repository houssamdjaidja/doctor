import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Phone,
  Mail,
  Clock,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "أ€ Propos", href: "/about" },
  { name: "Blog Santأ©", href: "/blog" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:+21321234567" className="flex items-center gap-2 hover:text-emerald-200 transition-colors">
              <Phone className="w-4 h-4" />
              +213 21 23 45 67
            </a>
            <a href="mailto:contact@dr-djaidja.dz" className="flex items-center gap-2 hover:text-emerald-200 transition-colors">
              <Mail className="w-4 h-4" />
              contact@dr-djaidja.dz
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Dim - Jeu: 8h - 18h | Sam: 9h - 12h
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-200/50"
            : "bg-white/80 backdrop-blur-md"
        )}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:shadow-xl group-hover:shadow-emerald-300 transition-all duration-300">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Dr. Djaidja
                </span>
                <p className="text-xs text-slate-500 mt-0.5">Mأ©decin Gأ©nأ©raliste</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    location.pathname === item.href
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-3">
              <Link to="/patient/login">
                <Button variant="ghost" size="sm">
                  Espace Patient
                </Button>
              </Link>
              <Link to="/appointment">
                <Button size="sm">
                  Prendre RDV
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-slate-100"
            >
              <div className="px-4 py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                      location.pathname === item.href
                        ? "text-emerald-600 bg-emerald-50"
                        : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <Link to="/patient/login" onClick={() => setIsOpen(false)}>
                    <Button variant="secondary" className="w-full">
                      Espace Patient
                    </Button>
                  </Link>
                  <Link to="/appointment" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">
                      Prendre Rendez-vous
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}