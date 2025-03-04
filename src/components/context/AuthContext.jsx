import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("token") || null);
	const [valid, setValid] = useState(false); // Track auth status

	useEffect(() => {
		if (token) {
			fetch("http://localhost:5000/api/auth/me", {
				method: "GET",
				headers: { Authorization: `Bearer ${token}` },
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.user) {
						setUser(data.user);
						setValid(true);
					} else {
						logout();
					}
				})
				.catch(() => logout());
		}
	}, [token]);

	const login = (userData, authToken) => {
		setUser(userData);
		setToken(authToken);
		setValid(true);
		localStorage.setItem("token", authToken);
	};

	const logout = () => {
		setUser(null);
		setToken(null);
		setValid(false);
		localStorage.removeItem("token");
	};

	return (
		<AuthContext.Provider value={{ user, token, valid, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
