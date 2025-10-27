// app.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./login.jsx";
import Signup from "./signup.jsx";
import Dashboard from "./dashboard.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return !user ? children : <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
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
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
