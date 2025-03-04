import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../components/context/AuthContext";
import logo from "../assets/images/logo.png";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { login } = useAuth(); // ✅ Get login function from context

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		try {
			const response = await fetch(
				"http://localhost:5000/api/auth/login",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				}
			);

			const data = await response.json();
			if (!response.ok) throw new Error(data.message || "Login failed");

			// ✅ Store Token & User Info
			login(data.user, data.token);
			navigate("/profile"); // ✅ Redirect
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700">
			<div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-6">
				<div className="text-center">
					<Link to="/" className="flex justify-center">
						<img src={logo} alt="logo" className="size-10" />
					</Link>
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
						Welcome Back
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Don’t have an account?{" "}
						<Link
							to="/signup"
							className="text-purple-600 hover:text-[#ff8d64cc] font-medium"
						>
							Sign up
						</Link>
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					{error && <p className="text-red-500 text-sm">{error}</p>}

					<div className="space-y-4">
						{/* Email Input */}
						<div className="relative">
							<Mail className="absolute left-3 top-3 text-gray-400" />
							<input
								type="email"
								placeholder="Email address"
								className="w-full px-4 py-3 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-600"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								autoComplete="current-password"
							/>
						</div>

						{/* Password Input */}
						<div className="relative">
							<Lock className="absolute left-3 top-3 text-gray-400" />
							<input
								type="password"
								placeholder="Password"
								className="w-full px-4 py-3 pl-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-600"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								autoComplete="current-password"
							/>
						</div>
					</div>

					<button type="submit" className="w-full btn-primary">
						Log in
					</button>
				</form>
			</div>
		</div>
	);
}
