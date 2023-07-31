import { useState, useEffect } from "react";
import { useAuth } from "../../contex/auth";
import { Navigate, Outlet, useLocation } from "react-router";
import { getUserAdminRoutes } from "../../Api/serverAPI";
import Spinner from "../Spinner";

export default function UserAdminRoutes() {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth("");
  const location = useLocation();

  useEffect(() => {
    const authCheck = async () => {
      const { data } = await getUserAdminRoutes();
      setOk(data.ok);
      setLoading(false);
    };

    if (auth?.token) {
      authCheck();
    } else {
      setLoading(false);
    }
  }, [auth?.token]);

  if (loading) {
    return <Spinner />;
  }

  return ok ? (
    <Outlet />
  ) : auth?.token ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
}
