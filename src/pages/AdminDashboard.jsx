import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsers, fetchEvents, deleteEvent } from "../api/admin";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { X, Search, Filter, Calendar, User, Tag, Trash2, Shield } from "lucide-react";

const AdminDashboard = () => {
	const [users, setUsers] = useState([]);
	const [events, setEvents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [eventToDelete, setEventToDelete] = useState(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [roleFilter, setRoleFilter] = useState("all");
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);

	// ✅ Redirect non-admin users
	useEffect(() => {
		if (!user || user.role !== "admin") {
			toast.error("Access denied. Admin privileges required.");
			navigate("/");
		}
	}, [user, navigate]);

	// ✅ Fetch all users and events
	useEffect(() => {
		const fetchAdminData = async () => {
			if (!user?.token) {
				toast.error("Authentication required");
				navigate("/login");
				return;
			}

			try {
				setLoading(true);
				const [usersData, eventsData] = await Promise.all([
					fetchUsers(user.token),
					fetchEvents(user.token)
				]);
				setUsers(usersData);
				setEvents(eventsData);
			} catch (err) {
				if (err.response?.status === 401) {
					toast.error("Session expired. Please login again.");
					navigate("/login");
				} else {
					toast.error("Failed to fetch admin data");
				}
			} finally {
				setLoading(false);
			}
		};

		fetchAdminData();
	}, [user, navigate]);

	// ✅ Handle delete confirmation
	const handleDeleteClick = (event) => {
		setEventToDelete(event);
		setShowDeleteModal(true);
	};

	// ✅ Handle event delete
	const handleDelete = async () => {
		if (!user?.token) {
			toast.error("Authentication required");
			navigate("/login");
			return;
		}

		try {
			await deleteEvent(eventToDelete._id);
			setEvents((prevEvents) =>
				prevEvents.filter((event) => event._id !== eventToDelete._id)
			);
			toast.success("Event deleted successfully");
			setShowDeleteModal(false);
			setEventToDelete(null);
		} catch (err) {
			if (err.response?.status === 401) {
				toast.error("Session expired. Please login again.");
				navigate("/login");
			} else {
				toast.error("Failed to delete event");
			}
		}
	};

	// ✅ Filter users based on search and role
	const filteredUsers = users.filter((u) => {
		const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			u.email.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesRole = roleFilter === "all" || u.role === roleFilter;
		return matchesSearch && matchesRole;
	});

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
			</div>
		);
	}

	return (
		<div className="p-6 max-w-7xl mx-auto">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
				<div className="flex items-center space-x-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
						<input
							type="text"
							placeholder="Search users..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
						/>
					</div>
					<div className="flex items-center space-x-2">
						<Filter className="text-gray-400 h-5 w-5" />
						<select
							value={roleFilter}
							onChange={(e) => setRoleFilter(e.target.value)}
							className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
						>
							<option value="all">All Roles</option>
							<option value="admin">Admin</option>
							<option value="user">User</option>
						</select>
					</div>
				</div>
			</div>

			{/* 👥 USERS */}
			<section className="mb-10 bg-white rounded-xl shadow-sm border border-gray-100">
				<div className="p-6 border-b border-gray-100">
					<h2 className="text-xl font-semibold text-gray-800 flex items-center">
						<Shield className="h-5 w-5 mr-2 text-purple-500" />
						User Management
					</h2>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{filteredUsers.map((u) => (
								<tr key={u._id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
												<User className="h-4 w-4 text-purple-600" />
											</div>
											<span className="ml-3 text-sm font-medium text-gray-900">{u.name}</span>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
											u.role === 'admin' 
												? 'bg-purple-100 text-purple-800' 
												: 'bg-green-100 text-green-800'
										}`}>
											{u.role}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* 📅 EVENTS */}
			<section className="bg-white rounded-xl shadow-sm border border-gray-100">
				<div className="p-6 border-b border-gray-100">
					<h2 className="text-xl font-semibold text-gray-800 flex items-center">
						<Calendar className="h-5 w-5 mr-2 text-purple-500" />
						Event Management
					</h2>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Details</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{events.map((e) => (
								<tr key={e._id} className="hover:bg-gray-50">
									<td className="px-6 py-4">
										<div className="text-sm font-medium text-gray-900">{e.title}</div>
										<div className="text-sm text-gray-500 line-clamp-2">{e.description}</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
											<Tag className="h-3 w-3 mr-1" />
											{e.category}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
										{new Date(e.date).toLocaleDateString()}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
												<User className="h-4 w-4 text-purple-600" />
											</div>
											<div className="ml-3">
												<div className="text-sm font-medium text-gray-900">{e.organizerName}</div>
												<div className="text-xs text-gray-500">{e.organizerId}</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<button
											onClick={() => handleDeleteClick(e)}
											className="text-red-600 hover:text-red-900 flex items-center"
										>
											<Trash2 className="h-4 w-4 mr-1" />
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* Delete Confirmation Modal */}
			{showDeleteModal && (
				<div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
					<div className="bg-white/95 backdrop-blur-md rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border border-gray-100">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold">Confirm Delete</h3>
							<button
								onClick={() => {
									setShowDeleteModal(false);
									setEventToDelete(null);
								}}
								className="text-gray-500 hover:text-gray-700 transition-colors"
							>
								<X className="h-5 w-5" />
							</button>
						</div>
						<p className="text-gray-600 mb-6">
							Are you sure you want to delete the event "{eventToDelete?.title}"? This action cannot be undone.
						</p>
						<div className="flex justify-end space-x-4">
							<button
								onClick={() => {
									setShowDeleteModal(false);
									setEventToDelete(null);
								}}
								className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handleDelete}
								className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminDashboard;
