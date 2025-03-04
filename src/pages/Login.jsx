import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import logo from "../assets/images/logo.png";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(""); // Handle login errors
	const navigate = useNavigate();

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

			if (!response.ok) {
				throw new Error(data.message || "Login failed");
			}

			// ✅ Store Token & Fetch Profile
			localStorage.setItem("token", data.token);

			// ✅ Fetch User Profile
			const profileResponse = await fetch(
				"http://localhost:5000/api/users/profile",
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${data.token}`, // Send token in headers
					},
				}
			);
			const profileData = await profileResponse.json();

			if (!profileResponse.ok) {
				throw new Error(
					profileData.message || "Failed to fetch profile"
				);
			}

			// ✅ Store User Data (for use in profile page)
			localStorage.setItem("user", JSON.stringify(profileData));

			// ✅ Redirect to Profile Page
			navigate("/profile");
		} catch (err) {
			setError(err.message);
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
						Don’t have an account?{" "}
						<Link
							to="/signup"
							className="font-medium text-purple-600 hover:text-[#ff8d64cc]"
						>
							Sign up
						</Link>
					</p>
				</div>

				<form onSubmit={handleSubmit} className="mt-8 space-y-6">
					{error && <p className="text-red-500 text-sm">{error}</p>}
					<div className="space-y-4">
						{/* Email Input */}
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
									className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
									placeholder="Email address"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
						</div>

						{/* Password Input */}
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
									className="w-full px-4 py-3 pl-10  border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
									placeholder="Password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
								/>
							</div>
						</div>
					</div>

					{/* Login Button */}
					<button
						type="submit"
						className="w-full  btn-primary"
					>
						Log in
					</button>
				</form>
			</div>
		</div>
	);
}