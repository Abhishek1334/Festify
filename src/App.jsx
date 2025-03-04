import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Events from "./pages/Events";
import EventPage from "./pages/EventPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserProfile from "./pages/UserProfile";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import CreateEvents from "./pages/CreateEvents";
import { AuthProvider } from "./components/context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
	return (
		<div className="min-h-screen flex flex-col">
			<AuthProvider>
				<Navbar />
				<ScrollToTop />
				<main className="flex-grow">
					<Routes>
						<Route path="/" element={<Homepage />} />
						<Route path="/events" element={<Events />} />
						<Route
							path="/events/category/:category"
							element={<Events />}
						/>
						<Route
							path="/events/:eventid"
							element={
								<ProtectedRoute>
									<EventPage />
								</ProtectedRoute>
							}
						/>
						<Route
							path="events/create-event"
							element={
								<ProtectedRoute>
									<CreateEvents />
								</ProtectedRoute>
							}
						/>
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />

						<Route
							path="/profile"
							element={
								<ProtectedRoute>
									<UserProfile />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</main>
				<Footer />
			</AuthProvider>
		</div>
	);
}
