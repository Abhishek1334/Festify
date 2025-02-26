import { Link } from "react-router-dom";
import { FiFacebook, FiTwitter, FiInstagram } from "react-icons/fi";
import logo from "../assets/images/logo-white.png";

export default function Footer() {
	return (
		<section>
			<footer className=" bg-gray-900 text-gray-300 hidden-section">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
						<div>
							<Link
								to="/"
								className="flex items-center space-x-2"
							>
								<img
									src={logo}
									alt="Festify Logo"
									className="h-8 w-8"
								/>
								<span className="text-xl font-bold text-white">
									Festify
								</span>
							</Link>
							<p className="mt-4 text-gray-400">
								Discover and book the best local events
								happening in your area.
							</p>
							<div className="flex space-x-4 mt-6">
								<a
									href="#"
									className="text-gray-400 hover:text-white transition-colors"
								>
									<FiFacebook className="h-6 w-6" />
								</a>
								<a
									href="#"
									className="text-gray-400 hover:text-white transition-colors"
								>
									<FiTwitter className="h-6 w-6" />
								</a>
								<a
									href="#"
									className="text-gray-400 hover:text-white transition-colors"
								>
									<FiInstagram className="h-6 w-6" />
								</a>
							</div>
						</div>

						<div>
							<h3 className="text-white font-semibold mb-4">
								Quick Links
							</h3>
							<ul className="space-y-2">
								<li>
									<Link
										to="/events"
										className="hover:text-white transition-colors"
									>
										Browse Events
									</Link>
								</li>
								<li>
									<Link
										to="/create-event"
										className="hover:text-white transition-colors"
									>
										Create Event
									</Link>
								</li>
								<li>
									<Link
										to="/Login"
										className="hover:text-white transition-colors"
									>
										Login
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="text-white font-semibold mb-4">
								Support
							</h3>
							<ul className="space-y-2">
								<li>
									<Link
										to="/help"
										className="hover:text-white transition-colors"
									>
										Help Center
									</Link>
								</li>
								<li>
									<Link
										to="/contact"
										className="hover:text-white transition-colors"
									>
										Contact Us
									</Link>
								</li>
								<li>
									<Link
										to="/faq"
										className="hover:text-white transition-colors"
									>
										FAQs
									</Link>
								</li>
								<li>
									<Link
										to="/terms"
										className="hover:text-white transition-colors"
									>
										Terms of Service
									</Link>
								</li>
							</ul>
						</div>

						<div>
							<h3 className="text-white font-semibold mb-4">
								Subscribe
							</h3>
							<p className="text-gray-400 mb-4">
								Get the latest updates about new events and
								special offers.
							</p>
							<form className="space-y-4">
								<input
									type="email"
									placeholder="Enter your email"
									className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
								/>
								<button
									type="submit"
									className="w-full btn-primary"
								>
									Subscribe
								</button>
							</form>
						</div>
					</div>

					<div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
						<p>
							&copy; {new Date().getFullYear()} Festify. All
							rights reserved.
						</p>
					</div>
				</div>
			</footer>
		</section>
	);
}
