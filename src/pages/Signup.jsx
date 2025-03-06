import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

export default function Signup() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const { signup } = useAuth(); 
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const success = await signup(username, email, password); 
		if (success) {
			alert("Signup Successful!");
			navigate("/user-profile");
		} else {
			alert("Signup Failed. Please try again.");
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<h2 className="text-2xl font-bold">Signup</h2>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
				<input
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
					className="border p-2 rounded"
					autoComplete="username"
				/>
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
					autoComplete="new-password"
					className="w-full p-2 border rounded"
				/>
				<button type="submit" className="bg-green-500 text-white p-2 rounded">
					Signup
				</button>
			</form>
		</div>
	);
}
