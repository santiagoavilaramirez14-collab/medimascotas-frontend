// src/App.jsx
// Definición de Rutas del Frontend
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user } = useAuth();

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Redirección inicial inteligente */}
          <Route
            path="/"
            element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
          />

          {/* Rutas Públicas de Autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas Privadas / Protegidas con Token JWT */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/perfil/editar" element={<EditProfile />} />
          </Route>

          {/* Ruta por defecto para URLs inexistentes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
