import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // ✅ Cleaner approach

const PrivateRoute = () => {
	const { user } = useAuth();
	return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
