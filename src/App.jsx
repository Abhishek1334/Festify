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
import { AuthProvider } from "./context/AuthProvider";
import EventDetails from "./pages/EventDetails";
import PrivateRoute from "./components/Auth/PrivateRoute";
import TicketCheckIn from "./pages/TicketCheckIn";
import AdminDashboard from "./pages/AdminDashboard";
import BackendDelayNotification from "./components/BackendDelayNotification";

export default function App() {

	return (
		<AuthProvider>
			<div className="min-h-screen flex flex-col">
				<BackendDelayNotification />
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
								path="/organizer/:eventId"
								element={<EventDetails />}
							/>

							<Route
								path="/events/create-event"
								element={<CreateEvents />}
							/>
							<Route
								path="/user-profile"
								element={<UserProfile />}
							/>
							<Route 
								path="/events/checkin/:eventId"
								element={<TicketCheckIn/>}
							/>
							<Route
								path="/admin"
								element={<AdminDashboard />}
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
