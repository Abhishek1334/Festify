import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import logo from "../assets/images/logo.png";
import { supabase } from "../supabase";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		setError(null); // Reset previous errors

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			setError(error.message);
		} else {
			navigate("/dashboard"); // Redirect to dashboard after successful login
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 py-12 px-4 sm:px-6 lg:px-8 flex items-center">
			<div className="max-w-md w-full mx-auto space-y-8 bg-white rounded-2xl shadow-xl p-8">
				<div className="text-center">
					<div className="flex justify-center">
						<Link to="/" className="size-10 cursor-pointer">
							<img
								src={logo}
								alt="logo"
								className="size-10 cursor-pointer"
							/>
						</Link>
					</div>
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
						Welcome back
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Don&lsquo;t have an account?{" "}
						<Link
							to="/signup"
							className="font-medium text-purple-600 hover:text-[#ff8d64cc]"
						>
							Sign up
						</Link>
					</p>
				</div>

				{error && <p>{error}</p>}

				<form
					className="mt-8 space-y-6 bg-gradient-to"
					onSubmit={handleLogin}
				>
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
									className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent pl-10"
									placeholder="Email address"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
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
									className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent pl-10"
									placeholder="Password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
								/>
							</div>
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<input
								id="remember-me"
								name="remember-me"
								type="checkbox"
								className="h-4 w-4  border-gray-300 rounded"
							/>
							<label
								htmlFor="remember-me"
								className="ml-2 block text-sm text-gray-900"
							>
								Remember me
							</label>
						</div>

						<div className="text-sm">
							<Link
								to="/forgot-password"
								className="font-medium text-purple-600 hover:text-[#ff8d64cc]"
							>
								Forgot your password?
							</Link>
						</div>
					</div>

					<button
						type="submit"
						className="w-full py-3 px-4 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition duration-300"
					>
						Login in
					</button>
				</form>
			</div>
		</div>
	);
}
