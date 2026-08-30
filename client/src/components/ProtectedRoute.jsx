import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

// Guards routes that require authentication. If there's no JWT in
// localStorage, bounce the user to /login instead of rendering the page.
function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
