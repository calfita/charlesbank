import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to={user ? "/dashboard" : "/login"}>
          <img src="/logo-charles.png" alt="Charles Bank" className="logo-img" />
        </Link>
      </div>

      <div className="navbar-right">
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}
        {!user && (
          <Link to="/login" className="navbar-login">Login</Link>
        )}
        {user && (
          <div className="profile-wrapper" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="profile-icon" title="Perfil">
              {user.fullName
                ? user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                : "CB"}
            </div>
            {menuOpen && (
              <div className="profile-menu">
                <Link to="/profile">Perfil</Link>
                <button onClick={logout}>Cerrar sesión</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
