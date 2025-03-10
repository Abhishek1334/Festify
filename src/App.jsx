import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import Events from "./pages/Events";
import EventPage from "./pages/EventPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserProfile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import CreateEvents from "./pages/CreateEvents";
import { AuthProvider } from "./context/AuthContext";
import OrganizerAdmin from "./pages/OrganizerPanel";
import OrganizerEventDetails from "./pages/OrganizerEventDetails";
import PrivateRoute from "./components/Auth/PrivateRoute";


export default function App() {

	return (
		<AuthProvider>
			<div className="min-h-screen flex flex-col">
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
							element={<EventPage />}
						/>

						{/* Protected Routes */}
						<Route element={<PrivateRoute />}>
							<Route
								path="/organizer"
								element={<OrganizerAdmin />}
							/>
							<Route
								path="/organizer/:eventId"
								element={<OrganizerEventDetails />}
							/>

							<Route
								path="/events/create-event"
								element={<CreateEvents />}
							/>
							<Route
								path="/user-profile"
								element={<UserProfile />}
							/>
						</Route>

						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</main>
				<Footer />
			</div>
		</AuthProvider>
	);
}
