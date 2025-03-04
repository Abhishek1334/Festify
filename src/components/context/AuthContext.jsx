import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [valid, setValid] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const res = await axios.get("/api/auth/me", {
					withCredentials: true,
				});
				setUser(res.data.user);
				setValid(true);
			} catch (error) {
				setUser(null);
				setValid(false);
			}
		};
		checkAuth();
	}, []);

	const login = async (credentials) => {
		try {
			const res = await axios.post("/api/auth/login", credentials, {
				withCredentials: true,
			});
			setUser(res.data.user);
			setValid(true);
		} catch (error) {
			console.error(
				"Login failed:",
				error.response?.data?.message || error.message
			);
		}
	};

	const logout = async () => {
		try {
			await axios.post("/api/auth/logout", {}, { withCredentials: true });
			setUser(null);
			setValid(false);
		} catch (error) {
			console.error(
				"Logout failed:",
				error.response?.data?.message || error.message
			);
		}
	};

	return (
		<AuthContext.Provider value={{ user, valid, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => useContext(AuthContext);
