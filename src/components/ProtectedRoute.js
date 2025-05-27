import { Navigate, Outlet } from "react-router-dom";
 
const ProtectedRoute = () => {
  const isLoggedIn = localStorage.getItem("loggedIn");
 
  return isLoggedIn ? <Outlet /> : <Navigate to="/SignInForm" />;
};
 
export default ProtectedRoute;
 