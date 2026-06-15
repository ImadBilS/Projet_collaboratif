import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { authService } from "../services/authService";

export default function Layout() {
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Vue d'ensemble", path: "/dashboard" },
    { icon: Users, label: "Utilisateurs", path: "/users" },
    { icon: FileText, label: "Ressources", path: "/resources" },
  ];

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar Gauche */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-slate-800">Help's Admin</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-blue-50 text-blue-700 font-medium" 
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Contenu Principal (Variable) */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet /> 
      </main>
    </div>
  );
}
