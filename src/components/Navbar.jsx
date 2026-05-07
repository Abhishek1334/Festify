import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Button } from './ui/Button';
import { cn } from '../lib/cn';

const navLinkClass = ({ isActive }) =>
	cn(
		'font-sans text-[15px] font-medium tracking-tight py-2',
		isActive ? 'text-ink' : 'text-muted hover:text-ink',
		'transition-colors'
	);

export default function Navbar() {
	const { user, logout } = useContext(AuthContext) || {};
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 4);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	useEffect(() => {
		document.body.style.overflow = open ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	const handleLogout = () => {
		logout?.();
		setOpen(false);
		navigate('/login');
	};

	const close = () => setOpen(false);
	const isAdmin = user?.role === 'admin';

	const links = (
		<>
			<NavLink to="/events" className={navLinkClass} onClick={close}>
				Events
			</NavLink>
			<NavLink to="/events/create-event" className={navLinkClass} onClick={close}>
				Host
			</NavLink>
			{user && (
				<NavLink to="/user-profile" className={navLinkClass} onClick={close}>
					Profile
				</NavLink>
			)}
			{isAdmin && (
				<NavLink to="/admin" className={navLinkClass} onClick={close}>
					Admin
				</NavLink>
			)}
		</>
	);

	return (
		<header
			className={cn(
				'sticky top-0 z-40 transition-all',
				scrolled
					? 'bg-paper/85 backdrop-blur-md border-b border-line'
					: 'bg-transparent border-b border-transparent'
			)}
		>
			<div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
				<div className="flex items-center justify-between h-16">
					<Link to="/" className="flex items-center gap-2" onClick={close}>
						<span className="font-display text-2xl font-semibold tracking-tight">
							Festify
						</span>
					</Link>

					<nav className="hidden lg:flex items-center gap-9">{links}</nav>

					<div className="hidden lg:flex items-center gap-3">
						{user ? (
							<Button variant="secondary" size="sm" onClick={handleLogout}>
								Log out
							</Button>
						) : (
							<>
								<Link to="/login">
									<Button variant="ghost" size="sm">
										Log in
									</Button>
								</Link>
								<Link to="/signup">
									<Button variant="primary" size="sm">
										Sign up
									</Button>
								</Link>
							</>
						)}
					</div>

					<button
						onClick={() => setOpen((v) => !v)}
						aria-label="Toggle menu"
						className="lg:hidden p-2 -mr-2 text-ink"
					>
						{open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
					</button>
				</div>
			</div>

			{/* Mobile sheet */}
			<div
				className={cn(
					'lg:hidden fixed inset-x-0 top-16 bottom-0 bg-paper border-t border-line z-30',
					'transition-transform duration-200',
					open ? 'translate-y-0' : '-translate-y-[120%] pointer-events-none'
				)}
			>
				<div className="px-6 py-8 flex flex-col gap-6 h-full">
					{links}
					<div className="border-t border-line my-2" />
					{user ? (
						<Button variant="secondary" onClick={handleLogout} block>
							Log out
						</Button>
					) : (
						<div className="flex flex-col gap-3">
							<Link to="/login" onClick={close}>
								<Button variant="secondary" block>
									Log in
								</Button>
							</Link>
							<Link to="/signup" onClick={close}>
								<Button variant="primary" block>
									Sign up
								</Button>
							</Link>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
