import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const success = await login(email, password);
		if (success) navigate("/UserProfile"); 
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<h2 className="text-2xl font-bold">Login</h2>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					className="border p-2 rounded"
					autoComplete="email"
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					className="border p-2 rounded"
					autoComplete="current-password"
				/>
				<button
					type="submit"
					className="bg-blue-500 text-white p-2 rounded"
				>
					Login
				</button>
			</form>
		</div>
	);
}
