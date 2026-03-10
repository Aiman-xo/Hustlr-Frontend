import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Spinner from "../pages/publilc/Spinner";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role,authInitialized } = useSelector(
    (state) => state.auth
  );
  console.log(isAuthenticated);

  if (!authInitialized) {
    return (
        <div className="h-screen flex items-center justify-center">
        <Spinner size={32} />
      </div>
    ); // or a spinner
  }

  // 1️⃣ Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // // 2️⃣ Logged in but not allowed
  // if (allowedRoles && !allowedRoles.includes(role)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  // 3️⃣ Allowed
  return <Outlet />;
};

export default ProtectedRoute;
