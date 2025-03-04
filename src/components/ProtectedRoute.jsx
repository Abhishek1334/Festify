import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../components/context/AuthContext";

export default function ProtectedRoute() {
	const { user } = useAuth();
	return user ? <Outlet /> : <Navigate to="/login" />;
}
