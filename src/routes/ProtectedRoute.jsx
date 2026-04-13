import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Spinner from "../pages/publilc/Spinner";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, role,authInitialized, isProfileSetup } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();
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

  // 2️⃣ Logged in but role not allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // 3️⃣ Enforce profile setup
  if (role === "worker" && !isProfileSetup && location.pathname !== "/worker/profile-setup") {
    return <Navigate to="/worker/profile-setup" replace />;
  }
  if (role === "employer" && !isProfileSetup && location.pathname !== "/employer/profile-setup") {
    return <Navigate to="/employer/profile-setup" replace />;
  }

  // 4️⃣ Allowed
  return <Outlet />;
};

export default ProtectedRoute;
