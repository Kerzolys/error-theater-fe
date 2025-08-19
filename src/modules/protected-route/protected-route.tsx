import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../services/zustand/store";
import { Preloader } from "../../shared/preloader/preloader";

const ProtectedRoute = () => {
  const { user, isSessionRestored } = useAuth();

  if (!isSessionRestored) return <Preloader />;
  if (!user) return <Navigate to="/admin" replace />;
  return <Outlet />;
};

export default ProtectedRoute;
