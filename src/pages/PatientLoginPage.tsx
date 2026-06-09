/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Stethoscope,
  ArrowRight,
  ArrowLeft,
  User,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { api } from "@/lib/api";

const isPhoneValid = (phone: string) => /^\d{10,11}$/.test(phone);

export function PatientLoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const navigate = useNavigate();

  const resetErrors = () => {
    setPasswordError("");
    setPhoneError("");
    setGeneralError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setGeneralError("");

    if (isAdmin) {
      try {
        const res = await api.adminLogin(formData.email, formData.password);
        localStorage.setItem("adminToken", res.token);
        navigate("/admin/dashboard");
      } catch (err: any) {
        setGeneralError(err.message);
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (formData.password.length < 8) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères");
      setSubmitting(false);
      return;
    }
    setPasswordError("");

    if (!isLogin) {
      if (!formData.phone.trim()) {
        setPhoneError("Le téléphone est requis");
        setSubmitting(false);
        return;
      }
      if (!isPhoneValid(formData.phone)) {
        setPhoneError("Le téléphone doit contenir 10 ou 11 chiffres");
        setSubmitting(false);
        return;
      }
      setPhoneError("");
    }

    try {
      if (isLogin) {
        try {
          const res = await api.login(formData.email, formData.password);
          localStorage.setItem("token", res.token);
          navigate("/patient/dashboard");
        } catch (err: any) {
          if (err.message?.includes("EMAIL_NOT_VERIFIED") || err.message?.includes("Veuillez vérifier")) {
            navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
            return;
          }
          throw err;
        }
      } else {
        await api.register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });
        navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (err: any) {
      setGeneralError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: e.target.value });
    if (passwordError) setPasswordError("");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, phone: e.target.value });
    if (phoneError) setPhoneError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        <Link to="/" className="absolute -top-12 left-0 p-2 rounded-xl hover:bg-white/60 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="text-xl font-bold text-slate-800">Dr. Benali</span>
              <p className="text-xs text-slate-500">Espace Patient</p>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            {isAdmin ? "Administration" : isLogin ? "Connexion" : "Créer un compte"}
          </h1>
          <p className="text-slate-600">
            {isAdmin ? "Accès réservé aux administrateurs" : isLogin ? "Accédez à votre espace patient personnel" : "Inscrivez-vous pour gérer vos rendez-vous"}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card variant="elevated">
            {!isAdmin && (
              <div className="flex gap-2 mb-6">
                <button onClick={() => { setIsLogin(true); resetErrors(); }}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${isLogin ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  Connexion
                </button>
                <button onClick={() => { setIsLogin(false); resetErrors(); }}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${!isLogin ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  Inscription
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && !isAdmin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Prénom</label>
                    <Input placeholder="Prénom" value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nom</label>
                    <Input placeholder="Nom" value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {isAdmin ? "Identifiant" : "Email"}
                </label>
                <div className="relative">
                  {isAdmin ? (
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  ) : (
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  )}
                  <Input type={isAdmin ? "text" : "email"}
                    placeholder={isAdmin ? "Nom d'utilisateur" : "votre@email.com"}
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>

              {!isLogin && !isAdmin && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone *</label>
                  <Input type="tel" placeholder="06 12 34 56 78" value={formData.phone}
                    onChange={handlePhoneChange} className={phoneError ? "border-red-500" : ""} />
                  {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
                  <p className="text-slate-400 text-xs mt-1">10 ou 11 chiffres (ex: 0612345678 ou 0212345678)</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input type={showPassword ? "text" : "password"} placeholder="••••••••"
                    className={`pl-10 pr-10 ${passwordError ? "border-red-500" : ""}`}
                    value={formData.password} onChange={handlePasswordChange} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                {!isAdmin && <p className="text-slate-400 text-xs mt-1">Minimum 8 caractères</p>}
              </div>

              {generalError && <p className="text-red-500 text-sm text-center">{generalError}</p>}

              {isLogin && !isAdmin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-slate-300" />
                    <span className="text-slate-600">Se souvenir de moi</span>
                  </label>
                  <Link to="/forgot-password" className="text-emerald-600 hover:text-emerald-700">Mot de passe oublié ?</Link>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "En cours..." : isAdmin ? "Se connecter" : isLogin ? "Se connecter" : "Créer mon compte"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </Card>
        </motion.div>

        <div className="text-center mt-6 space-y-2">
          {!isAdmin && (
            <p className="text-sm text-slate-500">
              {isLogin ? "Pas encore de compte ?" : "Déjà inscrit ?"}{" "}
              <button onClick={() => { setIsLogin(!isLogin); resetErrors(); }}
                className="text-emerald-600 hover:text-emerald-700 font-medium">
                {isLogin ? "S'inscrire" : "Se connecter"}
              </button>
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
