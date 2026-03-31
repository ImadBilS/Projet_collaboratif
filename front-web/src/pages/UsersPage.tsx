import { useEffect, useMemo, useState, type ReactNode } from "react";
import { PencilLine, RefreshCw, Shield, Trash2, Users } from "lucide-react";

import { authService } from "../services/authService";
import { usersService, type ManagedUser } from "../services/usersService";

const availableRoles = ["Citoyen", "Modérateur", "Administrateur"] as const;

export default function UsersPage() {
  const currentUser = authService.getCurrentUser();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return users.filter((user) => {
      if (!normalized) {
        return true;
      }

      return (
        `${user.firstname} ${user.lastname}`.toLowerCase().includes(normalized) ||
        user.mail.toLowerCase().includes(normalized) ||
        user.city.toLowerCase().includes(normalized) ||
        user.role.toLowerCase().includes(normalized)
      );
    });
  }, [query, users]);

  async function loadUsers() {
    setLoading(true);
    setError("");

    try {
      const response = await usersService.list();
      setUsers(response.users);
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "Chargement impossible."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  async function handleRoleChange(userId: number, role: string) {
    setSavingUserId(userId);
    setMessage("");
    setError("");

    try {
      const response = await usersService.updateRole(userId, role);
      setUsers((current) =>
        current.map((user) => (user.user_id === userId ? response.user : user))
      );
      setMessage("Rôle mis à jour.");
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "Mise à jour impossible."
      );
    } finally {
      setSavingUserId(null);
    }
  }

  async function handleDelete(userId: number) {
    const confirmed = window.confirm(
      "Supprimer ce compte revient ici à l’anonymiser. Continuer ?"
    );

    if (!confirmed) {
      return;
    }

    setSavingUserId(userId);
    setMessage("");
    setError("");

    try {
      const response = await usersService.delete(userId);
      setUsers((current) =>
        current.map((user) => (user.user_id === userId ? response.user : user))
      );
      setMessage("Compte anonymisé.");
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "Suppression impossible."
      );
    } finally {
      setSavingUserId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Utilisateurs</h1>
          <p className="text-sm text-slate-500">
            Lecture, changement de rôle et anonymisation depuis le portail admin.
          </p>
        </div>

        <div className="flex gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un utilisateur"
            className="w-72 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={() => void loadUsers()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </button>
        </div>
      </div>

      {message ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Comptes visibles" value={users.filter((user) => !user.is_anonymized).length} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Modération" value={users.filter((user) => user.role !== "Citoyen").length} icon={<Shield className="h-5 w-5" />} />
        <StatCard label="Anonymisés" value={users.filter((user) => user.is_anonymized).length} icon={<Trash2 className="h-5 w-5" />} />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <HeaderCell>Utilisateur</HeaderCell>
              <HeaderCell>Ville</HeaderCell>
              <HeaderCell>Rôle</HeaderCell>
              <HeaderCell>État</HeaderCell>
              <HeaderCell>Actions</HeaderCell>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                  Chargement...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const isCurrentUser = Number(currentUser?.user_id) === user.user_id;
                return (
                  <tr key={user.user_id} className="align-top">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">
                        {user.firstname} {user.lastname}
                      </div>
                      <div className="text-sm text-slate-500">{user.mail}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {user.city || "Non renseignée"}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        disabled={savingUserId === user.user_id || user.is_anonymized}
                        onChange={(event) =>
                          void handleRoleChange(user.user_id, event.target.value)
                        }
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      >
                        {availableRoles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.is_anonymized
                            ? "bg-slate-200 text-slate-600"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {user.is_anonymized ? "Anonymisé" : "Actif"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          disabled
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500"
                        >
                          <PencilLine className="h-4 w-4" />
                          Lecture back
                        </button>
                        <button
                          onClick={() => void handleDelete(user.user_id)}
                          disabled={
                            savingUserId === user.user_id ||
                            user.is_anonymized ||
                            isCurrentUser
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Anonymiser
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HeaderCell({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </th>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 inline-flex rounded-lg bg-blue-50 p-2 text-blue-700">
        {icon}
      </div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}
