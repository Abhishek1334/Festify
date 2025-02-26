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

export default function App() {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<ScrollToTop />
			<main className="flex-grow">
				<Routes>
					<Route path="/" element={<Homepage />} />
					<Route path="/events" element={<Events />} />
					<Route path="/events/category/:category" element={<Events />} />
					<Route path="/events/:eventid" element={<EventPage />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/profile" element={<UserProfile />} />
					
				</Routes>
			</main>
			<Footer />
		</div>
	);
}
