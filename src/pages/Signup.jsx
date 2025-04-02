import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, User } from "lucide-react";
import logo from "../assets/images/logo.png";
import { toast, ToastContainer } from "react-toastify";

export default function Signup() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const { signup } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await signup(username, email, password);

			if (response?.success) {
				toast.success("Signup successful!");
				navigate("/user-profile");
			} else {
				toast.error(
					response?.message || "Signup failed. Please try again."
				);
			}
		} catch (error) {
			console.error("Signup Error:", error);
			toast.error("An error occurred. Please try again.");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 py-12 px-4 sm:px-6 lg:px-8 flex items-center">
			<ToastContainer position="top-right" autoClose={3000} />
			<div className="max-w-md w-full mx-auto space-y-8 bg-white rounded-2xl shadow-2xl p-10">
				<div className="text-center">
					<img
						src={logo}
						alt="Logo"
						className="h-16 w-auto mx-auto"
					/>
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
						Create your account
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Already have an account?{" "}
						<Link
							to="/login"
							className="font-medium text-purple-600 hover:text-purple-500"
						>
							Sign in
						</Link>
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="space-y-4">
						<div className="relative">
							<User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
							<input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
								placeholder="Username"
								className="input-field pl-10"
								autoComplete="username"
							/>
						</div>

						<div className="relative">
							<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								placeholder="Email address"
								className="input-field pl-10"
								autoComplete="email"
							/>
						</div>

						<div className="relative">
							<Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								placeholder="Password"
								className="input-field pl-10"
								autoComplete="current-password"
							/>
						</div>
					</div>

					<button
						type="submit"
						className="btn-primary w-full flex justify-center items-center"
					>
						Sign up
					</button>
				</form>
			</div>
		</div>
	);
}
