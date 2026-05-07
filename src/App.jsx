import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackendDelayNotification from './components/BackendDelayNotification';
import { ErrorBoundary } from './components/ErrorBoundary';

import Homepage from './pages/Homepage';
import Events from './pages/Events';
import EventPage from './pages/EventPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound';
import CreateEvents from './pages/CreateEvents';
import EventDetails from './pages/EventDetails';
import TicketCheckIn from './pages/TicketCheckIn';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/Auth/PrivateRoute';

export default function App() {
	return (
		<ErrorBoundary>
			<div className="min-h-screen flex flex-col bg-paper text-ink">
				<BackendDelayNotification />
				<Navbar />
				<ScrollToTop />
				<main className="flex-grow">
					<Routes>
						<Route path="/" element={<Homepage />} />
						<Route path="/events" element={<Events />} />
						<Route path="/events/category/:category" element={<Events />} />
						<Route path="/events/:eventid" element={<EventPage />} />

						<Route element={<PrivateRoute />}>
							<Route path="/organizer/:eventId" element={<EventDetails />} />
							<Route path="/events/create-event" element={<CreateEvents />} />
							<Route path="/user-profile" element={<UserProfile />} />
							<Route path="/events/checkin/:eventId" element={<TicketCheckIn />} />
							<Route path="/admin" element={<AdminDashboard />} />
						</Route>

						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</main>
				<Footer />
				<ToastContainer
					position="bottom-right"
					autoClose={3500}
					hideProgressBar
					newestOnTop
					closeOnClick
					theme="light"
					toastClassName="!font-sans !text-sm !rounded-[12px] !shadow-[0_8px_24px_rgba(26,26,26,0.18)]"
				/>
			</div>
		</ErrorBoundary>
	);
}
