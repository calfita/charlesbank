import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate("/login"), 3000);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ fullName, email, password, dni }),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      {!success ? (
        <>
          <h2 className="login-title">Crear cuenta</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre completo"
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="DNI"
              className="form-input"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="btn-submit">
              Registrarme
            </button>
            {error && <p className="error-msg">{error}</p>}
          </form>
        </>
      ) : (
        <div className="success-box">
          <div className="checkmark">✔️</div>
          <h3>Registro exitoso</h3>
          <p>Serás redirigido al login en 3 segundos...</p>
        </div>
      )}
    </div>
  );
};

export default Register;
