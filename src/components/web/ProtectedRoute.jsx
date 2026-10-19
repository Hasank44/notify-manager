import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";

const ProtectedRoute = ({ children }) => {
    const user = useSelector((state) => state.user.user);
    const location = useLocation();
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};

export default ProtectedRoute;