import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  // Wait until auth loads user from localStorage
  if (loading) return <div>Loading...</div>;

  // If no user → redirect to login
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
  