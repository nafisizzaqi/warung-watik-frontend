import { Navigate } from "react-router-dom";
import Spinner from "./Effect/Spinner";

function PrivateRoute({ user, children, loading }) {
  if (loading) {
    return <Spinner />;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default PrivateRoute;
