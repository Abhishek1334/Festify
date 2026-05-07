import { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Search, Trash2 } from 'lucide-react';
import { fetchUsers, fetchEvents, deleteEvent } from '../api/admin';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Stamp } from '../components/ui/Stamp';
import { Modal } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { NumberTicker } from '../components/ui/NumberTicker';
import { cn } from '../lib/cn';

export default function AdminDashboard() {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	const qc = useQueryClient();

	const [search, setSearch] = useState('');
	const [roleFilter, setRoleFilter] = useState('all');
	const [tab, setTab] = useState('users');
	const [eventToDelete, setEventToDelete] = useState(null);

	useEffect(() => {
		if (!user || user.role !== 'admin') {
			toast.error('Admin only.');
			navigate('/');
		}
	}, [user, navigate]);

	const usersQ = useQuery({
		queryKey: ['admin', 'users'],
		queryFn: () => fetchUsers(user.token),
		enabled: !!user?.token && user?.role === 'admin',
	});

	const eventsQ = useQuery({
		queryKey: ['admin', 'events'],
		queryFn: () => fetchEvents(user.token),
		enabled: !!user?.token && user?.role === 'admin',
	});

	const deleteMutation = useMutation({
		mutationFn: (id) => deleteEvent(id),
		onSuccess: () => {
			toast.success('Event deleted.');
			setEventToDelete(null);
			qc.invalidateQueries({ queryKey: ['admin', 'events'] });
		},
		onError: () => toast.error('Could not delete event.'),
	});

	const filteredUsers = useMemo(() => {
		const list = usersQ.data || [];
		const q = search.trim().toLowerCase();
		return list.filter((u) => {
			const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
			const matchRole = roleFilter === 'all' || u.role === roleFilter;
			return matchSearch && matchRole;
		});
	}, [usersQ.data, search, roleFilter]);

	const filteredEvents = useMemo(() => {
		const list = eventsQ.data || [];
		const q = search.trim().toLowerCase();
		if (!q) return list;
		return list.filter(
			(e) =>
				e.title.toLowerCase().includes(q) ||
				(e.organizerName || '').toLowerCase().includes(q) ||
				(e.category || '').toLowerCase().includes(q)
		);
	}, [eventsQ.data, search]);

	if (!user || user.role !== 'admin') return null;

	return (
		<div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-12 sm:py-16">
			<div className="font-sans text-sm font-medium text-accent-deep uppercase tracking-wider mb-3">
				Admin
			</div>
			<h1
				className="font-display font-medium leading-[1.02] tracking-tight mb-10"
				style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
			>
				Back office.
			</h1>

			{/* Top stats */}
			<div className="grid grid-cols-3 gap-6 sm:gap-8 py-10 mb-10 border-y border-line">
				<Stat label="Users" value={(usersQ.data || []).length} />
				<Stat label="Events" value={(eventsQ.data || []).length} />
				<Stat
					label="Admins"
					value={(usersQ.data || []).filter((u) => u.role === 'admin').length}
				/>
			</div>

			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
				<div className="flex items-center gap-2 flex-wrap">
					{['users', 'events'].map((id) => {
						const active = tab === id;
						return (
							<button
								key={id}
								onClick={() => setTab(id)}
								className={cn(
									'px-5 py-2.5 rounded-full font-sans text-[15px] font-medium border transition-colors flex items-center gap-2 capitalize',
									active
										? 'bg-ink text-paper border-ink'
										: 'bg-paper-card text-ink border-line hover:border-ink hover:bg-paper-dim'
								)}
							>
								{id}
								<span className={cn('text-sm', active ? 'text-paper/60' : 'text-muted')}>
									{id === 'users' ? (usersQ.data || []).length : (eventsQ.data || []).length}
								</span>
							</button>
						);
					})}
				</div>

				<div className="flex items-center gap-3 flex-wrap">
					<div className="relative">
						<Search className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
						<input
							type="search"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search…"
							className="pl-11 pr-4 py-2.5 bg-paper-card border border-line rounded-full font-sans text-sm placeholder:text-muted-soft focus:outline-none focus:ring-2 focus:ring-ink/15 focus:border-ink w-60"
						/>
					</div>
					{tab === 'users' && (
						<select
							value={roleFilter}
							onChange={(e) => setRoleFilter(e.target.value)}
							className="px-4 py-2.5 bg-paper-card border border-line rounded-full font-sans text-sm focus:outline-none focus:ring-2 focus:ring-ink/15 focus:border-ink"
						>
							<option value="all">All roles</option>
							<option value="admin">Admin</option>
							<option value="organizer">Organizer</option>
							<option value="user">User</option>
						</select>
					)}
				</div>
			</div>

			{tab === 'users' && (
				<section>
					{usersQ.isLoading && <SkeletonRows />}
					{!usersQ.isLoading && filteredUsers.length === 0 && (
						<EmptyState title="No users match" art="search" />
					)}
					{!usersQ.isLoading && filteredUsers.length > 0 && (
						<div className="bg-paper-card rounded-[var(--radius-lg)] border border-line/60 overflow-hidden">
							<div className="grid grid-cols-[1fr_1fr_140px] gap-4 px-5 py-3 bg-paper-dim font-sans text-sm font-medium text-muted">
								<span>Name</span>
								<span>Email</span>
								<span>Role</span>
							</div>
							{filteredUsers.map((u) => (
								<div
									key={u._id}
									className="grid grid-cols-[1fr_1fr_140px] gap-4 px-5 py-4 border-t border-line hover:bg-paper-dim/40"
								>
									<span className="font-sans text-base text-ink truncate">{u.name}</span>
									<span className="font-sans text-sm text-muted truncate">{u.email}</span>
									<Stamp
										label={u.role.charAt(0).toUpperCase() + u.role.slice(1)}
										variant={u.role === 'admin' ? 'dark' : 'success'}
										size="sm"
										className="self-center justify-self-start"
									/>
								</div>
							))}
						</div>
					)}
				</section>
			)}

			{tab === 'events' && (
				<section>
					{eventsQ.isLoading && <SkeletonRows />}
					{!eventsQ.isLoading && filteredEvents.length === 0 && (
						<EmptyState title="No events match" art="search" />
					)}
					{!eventsQ.isLoading && filteredEvents.length > 0 && (
						<div className="bg-paper-card rounded-[var(--radius-lg)] border border-line/60 overflow-hidden">
							<div className="grid grid-cols-[1fr_140px_140px_140px_60px] gap-3 px-5 py-3 bg-paper-dim font-sans text-sm font-medium text-muted">
								<span>Title</span>
								<span>Category</span>
								<span>Date</span>
								<span>Host</span>
								<span></span>
							</div>
							{filteredEvents.map((e) => (
								<div
									key={e._id}
									className="grid grid-cols-[1fr_140px_140px_140px_60px] gap-3 px-5 py-4 border-t border-line items-center hover:bg-paper-dim/40"
								>
									<span className="font-sans text-base text-ink truncate">{e.title}</span>
									<span className="font-sans text-sm text-muted truncate">{e.category}</span>
									<span className="font-sans text-sm text-muted">
										{new Date(e.date).toLocaleDateString('en-IN', {
											month: 'short',
											day: 'numeric',
										})}
									</span>
									<span className="font-sans text-sm text-muted truncate">
										{e.organizerName || '—'}
									</span>
									<button
										onClick={() => setEventToDelete(e)}
										aria-label="Delete event"
										className="size-9 grid place-items-center rounded-full text-muted hover:bg-stamp/10 hover:text-stamp transition-colors"
									>
										<Trash2 className="size-3.5" />
									</button>
								</div>
							))}
						</div>
					)}
				</section>
			)}

			<Modal
				open={!!eventToDelete}
				onClose={() => setEventToDelete(null)}
				title="Delete event?"
				size="sm"
			>
				<p className="font-sans text-base text-ink mb-1">
					Delete <span className="font-medium">{eventToDelete?.title}</span>?
				</p>
				<p className="font-sans text-sm text-muted mb-7">
					Tickets will be cancelled. This cannot be undone.
				</p>
				<div className="flex justify-end gap-3">
					<Button variant="secondary" onClick={() => setEventToDelete(null)}>
						Keep
					</Button>
					<Button
						variant="stamp"
						onClick={() => deleteMutation.mutate(eventToDelete._id)}
						disabled={deleteMutation.isPending}
					>
						{deleteMutation.isPending ? 'Deleting…' : 'Delete'}
					</Button>
				</div>
			</Modal>
		</div>
	);
}

function Stat({ label, value }) {
	return (
		<div>
			<div
				className="font-display font-medium tabular text-ink leading-none tracking-tight"
				style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}
			>
				<NumberTicker value={value} />
			</div>
			<div className="mt-3 font-sans text-sm text-muted">{label}</div>
		</div>
	);
}

function SkeletonRows() {
	return (
		<div className="space-y-2">
			{Array.from({ length: 5 }).map((_, i) => (
				<Skeleton key={i} className="h-14 rounded-[var(--radius)]" />
			))}
		</div>
	);
}
