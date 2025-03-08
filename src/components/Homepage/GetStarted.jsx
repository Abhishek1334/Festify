import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const GetStarted = () => {
	const {user} = useContext(AuthContext);
	if (!user) {
		return (
			<section
				className={`py-16 bg-gradient-to-br from-purple-600 to-indigo-700`}
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center text-white">
						<h2 className="text-3xl font-bold mb-4">
							Ready to Host Your Own Event?
						</h2>
						<p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
							Create and manage your events with our easy-to-use
							platform
						</p>
						<Link to="/login">
							<button className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-purple-50 transition-colors duration-200 shadow-lg cursor-pointer">
								Get Started
							</button>
						</Link>
					</div>
				</div>
			</section>
		);
	}
	
};

export default GetStarted;
