import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/main";
import { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuth = useSelector((state: RootState) => Boolean(state.token));
  const user = useSelector((state: RootState) => state.user);
  const role = user?.role || "";
  const isAdmin = role === "admin";
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Only redirect to /admin if the user is NOT already on the admin page
  if (isAdmin && location.pathname !== "/admin") {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default ProtectedRoute;
