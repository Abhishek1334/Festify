import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; // ✅ Ensures consistency

const PrivateRoute = () => {
	const { user } = useContext(AuthContext) || {}; // ✅ Prevents potential crashes
	return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
