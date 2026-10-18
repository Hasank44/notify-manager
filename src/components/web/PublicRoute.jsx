import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const PublicRoute = ({ children }) => {
    const user = useSelector((state) => state.user.user);

    if (user) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;