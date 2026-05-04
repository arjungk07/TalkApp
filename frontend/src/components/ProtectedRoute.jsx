// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ProtectedRoute.jsx
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log("ProtectedRoute — loading:", loading, "user:", user); // ← add

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;