import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Stethoscope, Mail, ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";

export function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Le code doit contenir 6 chiffres");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await api.verifyEmail(email, code);
      localStorage.setItem("token", res.token);
      navigate("/patient/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      await api.resendCode(email);
      setMessage("Nouveau code envoyé");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        <Link to="/patient/login" className="absolute -top-12 left-0 p-3 sm:p-2 rounded-xl hover:bg-white/60 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="text-xl font-bold text-slate-800">Dr. Djaidja</span>
              <p className="text-xs text-slate-500">Vérification</p>
            </div>
          </Link>
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Vérifiez votre email</h1>
          <p className="text-slate-600">
            Un code de vérification à 6 chiffres a été envoyé à<br />
            <span className="font-medium text-slate-800">{email}</span>
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card variant="elevated">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Code de vérification</label>
                <Input
                  placeholder="000000"
                  value={code}
                  onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }}
                  className="text-center text-2xl tracking-[0.5em]"
                  maxLength={6}
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              {message && <p className="text-emerald-600 text-sm text-center">{message}</p>}

              <Button type="submit" className="w-full" disabled={submitting || code.length !== 6}>
                {submitting ? "Vérification..." : "Vérifier mon email"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </Card>
        </motion.div>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            Vous n'avez pas reçu le code ?{" "}
            <button onClick={handleResend} disabled={submitting}
              className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1 p-2 -ml-2">
              <RefreshCw className="w-3 h-3" /> Renvoyer
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
