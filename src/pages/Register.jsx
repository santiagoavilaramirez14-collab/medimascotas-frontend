// src/pages/Register.jsx
// Formulario de Registro de Usuario en la Base de Datos
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');

  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      await registerUser({
        nombre,
        email,
        password,
        telefono
      });
      // Redirige directamente al Dashboard al quedar autenticado con el token generado
      navigate('/dashboard');
    } catch (err) {
      console.error('Error de registro:', err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Error al conectar con el servidor. Verifica que el backend esté en ejecución.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="card-header">
          <h2>Crear Nueva Cuenta</h2>
          <p className="card-subtitle">Registra tus datos para guardarlos en la base de datos</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="form-group">
          <div className="input-field">
            <label htmlFor="nombre">Nombre Completo *</label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Juan Pérez"
              required
            />
          </div>

          <div className="input-field">
            <label htmlFor="email">Correo Electrónico *</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div className="input-field">
            <label htmlFor="telefono">Teléfono / Celular (Opcional)</label>
            <input
              id="telefono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="3101234567"
            />
          </div>

          <div className="input-field">
            <label htmlFor="password">Contraseña *</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={cargando}>
            {cargando ? 'Guardando en Base de Datos...' : 'Registrar Usuario'}
          </button>
        </form>

        <div className="card-footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="link-highlight">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
