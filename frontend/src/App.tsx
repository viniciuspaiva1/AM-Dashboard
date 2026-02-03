import React, { type JSX } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Componente de Proteção de Rota
function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();

  // Se não estiver logado, manda para o login
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/" element={<Login />} />

        {/* Rotas Privadas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Redireciona qualquer rota inexistente para o login ou dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
