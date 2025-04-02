import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/images/logo.png";
import { Mail, Lock } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await login(email, password);
			if (response.success) {
				toast.success("Login successful!");
				navigate("/user-profile");
			} else {
				toast.error(
					response.message || "Login failed. Please try again."
				);
			}
		} catch (error) {
			console.error("Login Error:", error);
			toast.error("An error occurred. Please try again.");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 py-12 px-4 sm:px-6 lg:px-8 flex items-center">
			<div className="fixed top-0 right-0 z-50">
				<ToastContainer />
			</div>
			<div className="max-w-md w-full mx-auto space-y-8 bg-white rounded-2xl shadow-2xl p-10">
				<div className="text-center">
					<div className="flex justify-center">
						<img src={logo} alt="Logo" className="h-16 w-auto" />
					</div>
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
						Welcome back
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Don&apos;t have an account?{" "}
						<Link
							to="/signup"
							className="font-medium text-purple-600 hover:text-purple-500"
						>
							Sign up
						</Link>
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="space-y-4">
						<div>
							<label htmlFor="email" className="sr-only">
								Email address
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="h-5 w-5 text-gray-400" />
								</div>
								<input
									id="email"
									name="email"
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="input-field pl-20"
									placeholder="Email address"
									autoComplete="email"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="password" className="sr-only">
								Password
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-gray-400" />
								</div>
								<input
									id="password"
									name="password"
									type="password"
									required
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									className="input-field"
									placeholder="Password"
									autoComplete="current-password"
								/>
							</div>
						</div>
					</div>

					<button
						type="submit"
						className="btn-primary w-full flex justify-center items-center"
					>
						Sign in
					</button>
				</form>
			</div>
		</div>
	);
}
