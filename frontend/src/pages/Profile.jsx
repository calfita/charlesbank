import { useState, useEffect } from "react";

import { apiFetch } from "../services/api";
import BackButton from "../components/BackButton";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [editing, setEditing] = useState({ phone: false, address: false });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiFetch("/auth/me");
        setProfile(data);
        setPhone(data.phone || "");
        setAddress(data.address || "");
      } catch (err) {
        console.error("Error al cargar perfil:", err.message);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/api/auth/me", {
        method: "PUT",
        body: JSON.stringify({ phone, address }),
      });
      setEditing({ phone: false, address: false });
      setMessage("Datos actualizados correctamente");
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setMessage("Error al actualizar los datos");
    }
  };

  if (!profile) return <p className="loading-msg">Cargando perfil...</p>;

  return (
    <>
      <BackButton />
      <div className="profile-container">
        <h2>Mi perfil</h2>
        <p>
          <strong>Nombre:</strong> {profile.fullName}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>DNI:</strong> {profile.dni}
        </p>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="editable-field">
            <label>Teléfono:</label>
            <div className="field-with-icon">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                readOnly={!editing.phone}
                className={!editing.phone ? "readonly" : ""}
              />
              <button
                type="button"
                className="edit-btn"
                onClick={() => setEditing({ ...editing, phone: true })}
              >
                ✏️
              </button>
            </div>
          </div>

          <div className="editable-field">
            <label>Domicilio:</label>
            <div className="field-with-icon">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                readOnly={!editing.address}
                className={!editing.address ? "readonly" : ""}
              />
              <button
                type="button"
                className="edit-btn"
                onClick={() => setEditing({ ...editing, address: true })}
              >
                ✏️
              </button>
            </div>
          </div>

          <button type="submit">Guardar cambios</button>
          {message && <p className="form-msg">{message}</p>}
        </form>
      </div>
    </>
  );
};

export default Profile;
