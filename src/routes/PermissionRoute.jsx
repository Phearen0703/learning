import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PermissionRoute = ({ permission, children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.permissions?.includes(permission)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default PermissionRoute;
