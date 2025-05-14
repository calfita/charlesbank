import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AccountDetail from "./pages/AccountDetail";
import NotFound from "./pages/NotFound";
import Navbar from "./components/NavBar";
import { Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Footer from "./components/Footer"; // 👈 Nuevo

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {!hideNavbar && <Navbar />}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route
            path="/"
            element={
              user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounts/:id"
            element={
              <ProtectedRoute>
                <AccountDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/dashboard" /> : <Register />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer /> {/* 👈 Pie de página siempre visible */}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
