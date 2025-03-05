import { createContext, useState, useEffect, useContext } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PropTypes } from "prop-types";


export const AuthContext = createContext();


const API_BASE_URL = "http://localhost:5000"; 
export const AuthProvider = ({ children }) => {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(localStorage.getItem("token") || null);

	useEffect(() => {
		if (token) {
			axios
				.get("/api/auth/profile", {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then((res) => setUser(res.data))
				.catch(() => logout());
		}
	}, [token]);

	const login = async (email, password) => {
		try {
			const res = await axios.post("/api/auth/login", {
				email,
				password,
			});
			setToken(res.data.token);
			localStorage.setItem("token", res.data.token);
			setUser(res.data.user);
			return true;
		} catch (error) {
			console.error("Login failed", error);
			return false;
		}
	};

	
	const signup = async (username, email, password) => {
		try {
			const res = await axios.post(
				"http://localhost:5000/api/auth/signup",
				{
					name: username, 
					email,
					password,
				}
			);

			setToken(res.data.token);
			localStorage.setItem("token", res.data.token);
			setUser(res.data.user);

			navigate("/UserProfile"); 
			return true;
		} catch (error) {
			console.error("Signup failed", error.response?.data || error);
			return false;
		}
	};


	const logout = () => {
		setUser(null);
		setToken(null);
		localStorage.removeItem("token");
	};

	return (
		<AuthContext.Provider value={{ user, token, login, signup, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

// ✅ Ensure useContext is properly used
export const useAuth = () => useContext(AuthContext);

AuthProvider.propTypes = {
	children: PropTypes.node.isRequired,
};