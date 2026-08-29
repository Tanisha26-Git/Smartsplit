import { Navigate } from "react-router-dom";

// Guards routes that require authentication. If there's no JWT in
// localStorage, bounce the user to /login instead of rendering the page.
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
