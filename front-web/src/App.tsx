import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import { authService } from "./services/authService";
import type React from "react";
import Register from "./pages/Register";

// Petit composant pour protéger les routes (si pas connecté -> Login)
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* Toutes les pages Admin sont dans le Layout */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* On crée les placeholders pour éviter les erreurs 404 si on clique */}
          <Route path="users" element={<div>Page Utilisateurs (A venir)</div>} />
          <Route path="services" element={<div>Page Services (A venir)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;