import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Stethoscope, Mail, ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Veuillez entrer votre email");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await api.forgotPassword(email);
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        <Link to="/patient/login" className="absolute -top-12 left-0 p-2 rounded-xl hover:bg-white/60 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="text-xl font-bold text-slate-800">Dr. Djaidja</span>
              <p className="text-xs text-slate-500">Mot de passe oublié</p>
            </div>
          </Link>
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Mot de passe oublié</h1>
          <p className="text-slate-600">
            Entrez votre email, nous vous enverrons un code de réinitialisation
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card variant="elevated">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input type="email" placeholder="votre@email.com" className="pl-10"
                    value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Envoi en cours..." : "Envoyer le code"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </Card>
        </motion.div>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            <Link to="/patient/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
              Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
