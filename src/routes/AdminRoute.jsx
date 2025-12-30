import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (!user.roles.includes("Admin")) return <Navigate to="/403" />;

  return children;
};

export default AdminRoute;
