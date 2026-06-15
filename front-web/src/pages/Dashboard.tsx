import { useEffect, useState } from "react";
import {
  Users,
  FileText,
  AlertTriangle,
  Eye,
  MessageCircle,
} from "lucide-react";
import { statsService, type DashboardStats } from "../services/statsService";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    statsService
      .getStats()
      .then((data) => {
        setStats(data);
      })
      .catch((nextError) => {
        setError(
          nextError instanceof Error
            ? nextError.message
            : "Chargement impossible."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-slate-500">Chargement des données...</div>;
  if (!stats) {
    return <div className="text-red-600">{error || "Aucune donnée disponible."}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Vue d'ensemble</h1>

      {/* 1. Les Cartes KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Carte Utilisateurs */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Utilisateurs Inscrits</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{stats.totalUsers}</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-full text-blue-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Carte Annonces */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Ressources publiques</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{stats.activeAds}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-full text-green-600">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        {/* Carte Signalements (Urgent) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Signalements à traiter</p>
            <p className="text-3xl font-bold text-red-600 mt-1">{stats.pendingReports}</p>
          </div>
          <div className="bg-red-50 p-3 rounded-full text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Vues cumulées</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{stats.totalViews}</p>
          </div>
          <div className="bg-violet-50 p-3 rounded-full text-violet-600">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Commentaires publiés</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{stats.totalComments}</p>
          </div>
          <div className="bg-amber-50 p-3 rounded-full text-amber-600">
            <MessageCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. Activité Récente */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Activité récente de la plateforme</h2>
        <div className="space-y-4">
          {stats.recentActivity.map((act) => (
            <div key={act.id} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0">
              <div>
                <span className="font-semibold text-slate-700">{act.user}</span>
                <span className="text-slate-500 text-sm ml-2">- {act.action}</span>
              </div>
              <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">
                {act.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
