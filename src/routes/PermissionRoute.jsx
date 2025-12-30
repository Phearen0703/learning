import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PermissionRoute = ({ permission, children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (!user.permissions.includes(permission))
    return <Navigate to="/403" />;

  return children;
};

export default PermissionRoute;
