// src/pages/Dashboard.jsx
// Panel Principal del Sistema
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { obtenerDashboard } from '../services/auth';

export default function Dashboard() {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    obtenerDashboard()
      .then((data) => setDashboardData(data))
      .catch((err) => console.error('Error al cargar datos del dashboard:', err))
      .finally(() => setCargando(false));
  }, []);

  const handleEliminarCuenta = async () => {
    const confirmacion = window.confirm(
      '⚠️ ¿Estás seguro de que deseas eliminar tu cuenta permanentemente?\nEsta acción borrará tus registros de la base de datos de manera irreversible.'
    );

    if (!confirmacion) return;

    try {
      setEliminando(true);
      await deleteAccount();
      alert('✅ Cuenta eliminada correctamente de la base de datos.');
      navigate('/login');
    } catch (err) {
      console.error('Error al eliminar cuenta:', err);
      alert('❌ No se pudo eliminar la cuenta. Intenta de nuevo.');
      setEliminando(false);
    }
  };

  const nombreUsuario = user?.nombre || user?.name || 'Usuario';

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>¡Bienvenido, {nombreUsuario}! 👋</h1>
        <p className="subtitle">
          Panel de control de usuario autenticado con JWT y sincronizado con MySQL
        </p>
      </div>

      {mensaje && <div className="alert alert-success">{mensaje}</div>}

      <div className="dashboard-grid">
        {/* Tarjeta de Información de Usuario */}
        <div className="card dashboard-card">
          <div className="card-header">
            <h3>👤 Información de la Cuenta</h3>
          </div>
          <div className="card-body">
            <ul className="info-list">
              <li>
                <strong>ID en Base de Datos:</strong>
                <span className="badge badge-id">#{user?.id}</span>
              </li>
              <li>
                <strong>Nombre:</strong>
                <span>{nombreUsuario}</span>
              </li>
              <li>
                <strong>Correo Electrónico:</strong>
                <span>{user?.email}</span>
              </li>
              <li>
                <strong>Rol Asignado:</strong>
                <span className="badge badge-role">{user?.rol || 'propietario'}</span>
              </li>
              <li>
                <strong>Teléfono:</strong>
                <span>{user?.telefono || 'No registrado'}</span>
              </li>
              {user?.fecha_creacion && (
                <li>
                  <strong>Fecha de Registro:</strong>
                  <span>{new Date(user.fecha_creacion).toLocaleDateString()}</span>
                </li>
              )}
            </ul>
          </div>
          <div className="card-footer actions">
            <Link to="/perfil/editar" className="btn btn-primary">
              ✏️ Editar Perfil
            </Link>
            <Link to="/perfil" className="btn btn-secondary">
              👁️ Ver Detalles
            </Link>
          </div>
        </div>

        {/* Tarjeta de Estado del Sistema */}
        <div className="card dashboard-card">
          <div className="card-header">
            <h3>⚡ Estado del Sistema y Base de Datos</h3>
          </div>
          <div className="card-body">
            <ul className="info-list">
              <li>
                <strong>Servidor Backend:</strong>
                <span className="status-online">🟢 Activo (Puerto 3000)</span>
              </li>
              <li>
                <strong>Autenticación:</strong>
                <span className="badge badge-success">JWT Verificado</span>
              </li>
              <li>
                <strong>Base de Datos:</strong>
                <span>{dashboardData?.estadoSistema?.baseDeDatos || 'MySQL (medimascotas_db)'}</span>
              </li>
              <li>
                <strong>Token en Almacenamiento:</strong>
                <span>{localStorage.getItem('token') ? 'Guardado en LocalStorage' : 'No disponible'}</span>
              </li>
            </ul>

            <div className="alert alert-info" style={{ marginTop: '16px' }}>
              💡 <strong>Demostración para sustentación:</strong> Cualquier cambio que realices en tu perfil o si creas un nuevo usuario, se refleja directamente en la base de datos relacional.
            </div>
          </div>
          <div className="card-footer actions">
            <button
              onClick={handleEliminarCuenta}
              className="btn btn-danger"
              disabled={eliminando}
            >
              {eliminando ? 'Eliminando...' : '🗑️ Eliminar Mi Cuenta'}
            </button>
            <button onClick={logout} className="btn btn-outline">
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
