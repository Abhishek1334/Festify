import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import { Mail, Lock, User } from "lucide-react";
import logo from "../assets/images/logo.png";

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
		<div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 py-12 px-4 sm:px-6 lg:px-8 flex items-center">
			<div className="max-w-md w-full mx-auto space-y-8 bg-white rounded-2xl shadow-2xl p-10 ">
				<div className="text-center">
					<div className="flex justify-center">
						<img src={logo} alt="Logo" className="h-16 w-auto" />
					</div>
					<h2 className="mt-6 text-3xl font-extrabold text-gray-900">
						Create your account
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Already have an account?{" "}
						<Link
							to="/signup"
							className="font-medium text-purple-600 hover:text-purple-500"
						>
							Sign in
						</Link>
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="space-y-4">
						<div>
							<label htmlFor="username" className="sr-only">
								Username
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<User className="h-5 w-5 text-gray-400 " />
								</div>
								<input
									id="username"
									name="username"
									type="text"
									required
									value={username}
									onChange={(e) =>
										setUsername(e.target.value)
									}
									className="input-field pl-20"
									placeholder="Username"
									autoComplete="username"
								/>
							</div>
						</div>

						<div>
							<label htmlFor="email" className="sr-only ">
								Email address
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="h-5 w-5 text-gray-400 " />
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
							<div className="relative ">
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
									className="input-field "
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
