import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const token = user?.token || ""; // Extract token
	const API_URL = import.meta.env.VITE_API_URL;
	const navigate = useNavigate();

	// Load user from localStorage when the app starts
	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
	}, []);

	const signup = async (name, email, password) => {
		try {
			const res = await axios.post(`${API_URL}/auth/signup`, {
				name,
				email,
				password,
			});
			setUser(res.data);
			localStorage.setItem("user", JSON.stringify(res.data));
			return true;
		} catch (error) {
			console.error("Signup failed", error.response?.data);
			return false;
		}
	};

	const login = async (email, password) => {
		try {
			const res = await axios.post(`${API_URL}/auth/login`, {
				email,
				password,
			});
			setUser(res.data);
			localStorage.setItem("user", JSON.stringify(res.data));
			return true;
		} catch (error) {
			console.error("Login failed", error.response?.data);
			return false;
		}
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
		navigate("/"); 
	};

	return (
		<AuthContext.Provider
			value={{ user, token, setUser, signup, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

// ✅ Custom hook for consuming AuthContext
export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};