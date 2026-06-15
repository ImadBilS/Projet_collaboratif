import { useEffect, useMemo, useState } from "react";
import { Plus, RefreshCw, Trash2 } from "lucide-react";

import {
  resourcesService,
  type ManagedResource,
} from "../services/resourcesService";

const availableCategories = [
  "OTHER",
  "EDUCATION",
  "SOCIAL_SUPPORT",
  "EVENTS",
  "COMMUNITY",
  "CULTURE",
  "HEALTH",
  "JOB_HELP",
] as const;

type ResourceForm = {
  wording: string;
  content: string;
  visibility: "PUBLIC" | "PRIVATE";
  category: string;
};

const initialForm: ResourceForm = {
  wording: "",
  content: "",
  visibility: "PUBLIC",
  category: "OTHER",
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<ManagedResource[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<ResourceForm>(initialForm);

  const filteredResources = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return resources.filter((resource) => {
      if (!normalized) {
        return true;
      }

      const author = resource.user
        ? `${resource.user.firstname} ${resource.user.lastname}`.toLowerCase()
        : "";

      return (
        resource.wording.toLowerCase().includes(normalized) ||
        (resource.content ?? "").toLowerCase().includes(normalized) ||
        author.includes(normalized) ||
        resource.category.join(" ").toLowerCase().includes(normalized)
      );
    });
  }, [query, resources]);

  async function loadResources() {
    setLoading(true);
    setError("");

    try {
      const nextResources = await resourcesService.list();
      setResources(nextResources);
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "Chargement impossible."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Chargement initial des données depuis l'API : ce setState asynchrone
    // (dans loadResources) est le point d'entrée standard pour synchroniser
    // l'état avec une source externe au montage du composant.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadResources();
  }, []);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setCreating(true);
    setError("");
    setMessage("");

    try {
      const created = await resourcesService.create({
        wording: form.wording.trim(),
        content: form.content.trim(),
        visibility: form.visibility,
        category: [form.category],
      });

      setResources((current) => [created, ...current]);
      setForm(initialForm);
      setMessage(
        "Ressource créée. Elle est maintenant visible via l’API partagée."
      );
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "Création impossible."
      );
    } finally {
      setCreating(false);
    }
  }

  async function handleInlineUpdate(
    resourceId: number,
    payload: Pick<ResourceForm, "wording" | "content" | "visibility" | "category">
  ) {
    setSavingId(resourceId);
    setError("");
    setMessage("");

    try {
      const updated = await resourcesService.update(resourceId, {
        wording: payload.wording.trim(),
        content: payload.content.trim(),
        visibility: payload.visibility,
        category: [payload.category],
      });
      setResources((current) =>
        current.map((resource) =>
          resource.ressource_id === resourceId ? updated : resource
        )
      );
      setMessage("Ressource mise à jour.");
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "Mise à jour impossible."
      );
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(resourceId: number) {
    const confirmed = window.confirm("Supprimer cette ressource ?");

    if (!confirmed) {
      return;
    }

    setSavingId(resourceId);
    setError("");
    setMessage("");

    try {
      await resourcesService.delete(resourceId);
      setResources((current) =>
        current.filter((resource) => resource.ressource_id !== resourceId)
      );
      setMessage("Ressource supprimée.");
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "Suppression impossible."
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ressources</h1>
          <p className="text-sm text-slate-500">
            CRUD complet sur les ressources. Toute création ici sera relue
            ensuite par le mobile via l’API.
          </p>
        </div>

        <div className="flex gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher une ressource"
            className="w-72 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <button
            onClick={() => void loadResources()}
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

      <form
        onSubmit={handleCreate}
        className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <input
          value={form.wording}
          onChange={(event) =>
            setForm((current) => ({ ...current, wording: event.target.value }))
          }
          placeholder="Titre ou wording de la ressource"
          className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          required
        />
        <textarea
          value={form.content}
          onChange={(event) =>
            setForm((current) => ({ ...current, content: event.target.value }))
          }
          placeholder="Contenu de la ressource"
          className="min-h-28 rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          required
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[180px_180px_auto]">
          <select
            value={form.visibility}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                visibility: event.target.value as ResourceForm["visibility"],
              }))
            }
            className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="PUBLIC">PUBLIC</option>
            <option value="PRIVATE">PRIVATE</option>
          </select>
          <select
            value={form.category}
            onChange={(event) =>
              setForm((current) => ({ ...current, category: event.target.value }))
            }
            className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={creating}
            className="inline-flex h-10 items-center justify-center gap-2 justify-self-start rounded-lg bg-blue-700 px-3 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-70"
          >
            <Plus className="h-4 w-4" />
            {creating ? "Création..." : "Créer"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Chargement...
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Aucune ressource trouvée.
          </div>
        ) : (
          filteredResources.map((resource) => (
            <EditableResourceCard
              key={resource.ressource_id}
              resource={resource}
              saving={savingId === resource.ressource_id}
              onSave={handleInlineUpdate}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

function EditableResourceCard({
  resource,
  saving,
  onSave,
  onDelete,
}: {
  resource: ManagedResource;
  saving: boolean;
  onSave: (
    resourceId: number,
    payload: Pick<ResourceForm, "wording" | "content" | "visibility" | "category">
  ) => Promise<void>;
  onDelete: (resourceId: number) => Promise<void>;
}) {
  const [wording, setWording] = useState(resource.wording);
  const [content, setContent] = useState(resource.content ?? "");
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">(
    resource.visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE"
  );
  const [category, setCategory] = useState(resource.category[0] ?? "OTHER");

  // Si la ressource reçue change (ex: rafraîchissement après sauvegarde),
  // on resynchronise les champs locaux pendant le rendu plutôt que dans un
  // effet, conformément à la doc React sur l'ajustement d'état au rendu.
  const [previousResource, setPreviousResource] = useState(resource);
  if (previousResource !== resource) {
    setPreviousResource(resource);
    setWording(resource.wording);
    setContent(resource.content ?? "");
    setVisibility(resource.visibility === "PUBLIC" ? "PUBLIC" : "PRIVATE");
    setCategory(resource.category[0] ?? "OTHER");
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-800">
            #{resource.ressource_id} {resource.wording}
          </div>
          <div className="text-sm text-slate-500">
            Auteur:{" "}
            {resource.user
              ? `${resource.user.firstname} ${resource.user.lastname}`
              : `#${resource.user_id}`}
          </div>
          {resource.content ? (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              {resource.content}
            </p>
          ) : null}
        </div>
        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {resource.visibility}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <input
          value={wording}
          onChange={(event) => setWording(event.target.value)}
          className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="min-h-28 rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[180px_180px_auto_auto]">
          <select
            value={visibility}
            onChange={(event) =>
              setVisibility(event.target.value as "PUBLIC" | "PRIVATE")
            }
            className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="PUBLIC">PUBLIC</option>
            <option value="PRIVATE">PRIVATE</option>
          </select>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-lg border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            {availableCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button
            onClick={() =>
              void onSave(resource.ressource_id, {
                wording,
                content,
                visibility,
                category,
              })
            }
            disabled={saving}
            className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-70"
          >
            {saving ? "..." : "Enregistrer"}
          </button>
          <button
            onClick={() => void onDelete(resource.ressource_id)}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 disabled:opacity-70"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
