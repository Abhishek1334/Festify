import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	// Load user from localStorage when the app starts
	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
	}, []);

	const signup = async (name, email, password) => {
		try {
			const res = await axios.post(
				"http://localhost:5000/api/auth/signup",
				{
					name,
					email,
					password,
				}
			);
			setUser(res.data);
			localStorage.setItem("user", JSON.stringify(res.data));
			return true; // ✅ Return success status
		} catch (error) {
			console.error("Signup failed", error.response?.data);
			return false; // ❌ Return failure status
		}
	};


	const login = async (email, password) => {
		try {
			const res = await axios.post(
				"http://localhost:5000/api/auth/login",
				{
					email,
					password,
				}
			);
			setUser(res.data);
			localStorage.setItem("user", JSON.stringify(res.data));
			return true; // ✅ Return success
		} catch (error) {
			console.error("Login failed", error.response?.data);
			return false; // ❌ Return failure
		}
	};


	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
	};

	return (
		<AuthContext.Provider value={{ user, setUser, signup, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

// ✅ Custom hook for consuming AuthContext
export const useAuth = () => useContext(AuthContext);
