import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import { authService } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await authService.login(email, password);
      // Succès -> On ira vers le Dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      {/* Carte principale */}
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md border-t-4 border-blue-600">

        {/* En-tête avec Logo/Icône */}
        <div className="text-center mb-8">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-blue-700 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">
            (RE)Sources Relationnelles
          </h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Portail d'AdministrationNNNN
          </p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Identifiant</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 block"
                placeholder="admin@gouv.fr"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 block"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Connexion..." : "Accéder au portail"}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-6 border-t pt-4 text-center">
          <p className="text-xs text-slate-400">
            Accès réservé aux agents modérateurs.<br />
            Toute connexion est enregistrée.
          </p>
        </div>
      </div>
    </div>
  );
}