import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Calendar,
  MapPin,
  Hash,
  Globe,
  ArrowRight,
  ShieldCheck,
  Home,
  UserCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { authService } from "../services/authService";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RegisterForm {
  firstname: string;
  lastname: string;
  birth: string;
  mail: string;
  password: string;
  confirmPassword: string;
  role: string;
  sex: string;
  street_number: string;
  street_type: string;
  postal_code: string;
  address_complement: string | null;
  city: string;
  country: string;
}

const initialForm: RegisterForm = {
  firstname: "",
  lastname: "",
  birth: "",
  mail: "",
  password: "",
  confirmPassword: "",
  role: "Citoyen",
  sex: "",
  street_number: "",
  street_type: "",
  postal_code: "",
  address_complement: null,
  city: "",
  country: "",
};

// ─── Sous-composants UI ───────────────────────────────────────────────────────

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

function SectionHeader({ icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="bg-blue-50 p-2 rounded-lg shrink-0">{icon}</div>
      <h2 className="text-xs font-bold text-slate-600 uppercase tracking-widest whitespace-nowrap">
        {title}
      </h2>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

interface FieldProps {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

function Field({ label, icon, children }: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
        {label}
      </label>
      {icon ? (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </span>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

// ─── Classes réutilisables ────────────────────────────────────────────────────

const inputClass =
  "w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all";
const inputWithIconClass = `${inputClass} pl-10`;
const selectClass =
  "w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all cursor-pointer";

// ─── Composant principal ──────────────────────────────────────────────────────

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]: name === "address_complement" && value === "" ? null : value,
  }));
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);

    try {
      // On exclut confirmPassword du payload envoyé à l'API
      const { confirmPassword: _, ...rest } = form;
      await authService.register({
        ...rest,
        street_number: Number(rest.street_number),
        postal_code: Number(rest.postal_code),
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Rendu succès ──────────────────────────────────────────────────────────

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-md border-t-4 border-green-500 text-center">
          <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-green-600 w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Inscription réussie
          </h2>
          <p className="text-slate-500 text-sm">
            Le compte a été créé avec succès. Redirection vers la page de
            connexion…
          </p>
        </div>
      </div>
    );
  }

  // ─── Rendu formulaire ──────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-12">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border-t-4 border-blue-600 overflow-hidden">

        {/* ── En-tête ── */}
        <div className="px-8 pt-8 pb-6 text-center border-b border-slate-100">
          <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="text-blue-700 w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
            (RE)Sources Relationnelles
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Portail d'Administration — Création de compte
          </p>
        </div>

        {/* ── Corps ── */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">

          {/* Erreur globale */}
          {error && (
            <div className="flex items-start gap-3 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              SECTION 1 — Informations Personnelles
          ════════════════════════════════════════════════════════════════ */}
          <div>
            <SectionHeader
              icon={<UserCircle className="w-4 h-4 text-blue-600" />}
              title="Informations Personnelles"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Prénom */}
              <Field label="Prénom" icon={<User className="w-4 h-4" />}>
                <input
                  type="text"
                  name="firstname"
                  value={form.firstname}
                  onChange={handleChange}
                  className={inputWithIconClass}
                  placeholder="Jean"
                  required
                />
              </Field>

              {/* Nom */}
              <Field label="Nom" icon={<User className="w-4 h-4" />}>
                <input
                  type="text"
                  name="lastname"
                  value={form.lastname}
                  onChange={handleChange}
                  className={inputWithIconClass}
                  placeholder="Dupont"
                  required
                />
              </Field>

              {/* Date de naissance */}
              <Field label="Date de naissance" icon={<Calendar className="w-4 h-4" />}>
                <input
                  type="date"
                  name="birth"
                  value={form.birth}
                  onChange={handleChange}
                  className={inputWithIconClass}
                  required
                />
              </Field>

              {/* Sexe */}
              <Field label="Sexe">
                <select
                  name="sex"
                  value={form.sex}
                  onChange={handleChange}
                  className={selectClass}
                  required
                >
                  <option value="" disabled>
                    — Sélectionner —
                  </option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                  <option value="Autre">Autre</option>
                </select>
              </Field>

              {/* Email */}
              <Field label="Adresse e-mail" icon={<Mail className="w-4 h-4" />}>
                <input
                  type="email"
                  name="mail"
                  value={form.mail}
                  onChange={handleChange}
                  className={inputWithIconClass}
                  placeholder="jean.dupont@exemple.fr"
                  required
                />
              </Field>

              {/* Rôle */}
              {/* 
              <Field label="Rôle">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Shield className="w-4 h-4" />
                  </span>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className={`${selectClass} pl-10`}
                    required
                  >
                    <option value="" disabled>
                      — Sélectionner —
                    </option>
                    <option value="Citoyen">Citoyen</option>
                    <option value="Modérateur">Modérateur</option>
                    <option value="Administrateur">Administrateur</option>
                  </select>
                </div>
              </Field>
                */}
              {/* Mot de passe */}
              <Field label="Mot de passe" icon={<Lock className="w-4 h-4" />}>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={inputWithIconClass}
                  placeholder="••••••••"
                  minLength={8}
                  required
                />
              </Field>

              {/* Confirmation mot de passe */}
              <Field label="Confirmer le mot de passe" icon={<Lock className="w-4 h-4" />}>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={inputWithIconClass}
                  placeholder="••••••••"
                  minLength={8}
                  required
                />
              </Field>

            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════════
              SECTION 2 — Adresse
          ════════════════════════════════════════════════════════════════ */}
          <div>
            <SectionHeader
              icon={<Home className="w-4 h-4 text-blue-600" />}
              title="Adresse"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Numéro de rue */}
              <Field label="Numéro" icon={<Hash className="w-4 h-4" />}>
                <input
                  type="number"
                  name="street_number"
                  value={form.street_number}
                  onChange={handleChange}
                  className={inputWithIconClass}
                  placeholder="12"
                  min={1}
                  required
                />
              </Field>

              {/* Type de voie */}
              <Field label="Type de voie" icon={<MapPin className="w-4 h-4" />}>
                <input
                  type="text"
                  name="street_type"
                  value={form.street_type}
                  onChange={handleChange}
                  className={inputWithIconClass}
                  placeholder="Rue, Avenue, Boulevard…"
                  required
                />
              </Field>

              {/* Code postal */}
              <Field label="Code postal" icon={<Hash className="w-4 h-4" />}>
                <input
                  type="number"
                  name="postal_code"
                  value={form.postal_code}
                  onChange={handleChange}
                  className={inputWithIconClass}
                  placeholder="75000"
                  required
                />
              </Field>

              {/* Ville */}
              <Field label="Ville" icon={<MapPin className="w-4 h-4" />}>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className={inputWithIconClass}
                  placeholder="Paris"
                  required
                />
              </Field>

              {/* Complément d'adresse */}
              <Field label="Complément d'adresse" icon={<Home className="w-4 h-4" />}>
                <input
                  type="text"
                  name="address_complement"
                  value={form.address_complement ?? ""}
                  onChange={handleChange}
                  className={inputWithIconClass}
                  placeholder="Bâtiment B, Apt. 42…"
                  
                />
              </Field>

              {/* Pays */}
              <Field label="Pays" icon={<Globe className="w-4 h-4" />}>
                <input
                  type="text"
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className={inputWithIconClass}
                  placeholder="France"
                  required
                />
              </Field>

            </div>
          </div>

          {/* ── Bouton de soumission ── */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Création en cours…" : "Créer le compte"}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* ── Pied de page ── */}
        <div className="px-8 pb-6 border-t border-slate-100 pt-4 text-center">
          <p className="text-xs text-slate-400">
            Vous avez déjà un compte ?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-semibold"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
