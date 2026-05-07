import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Stamp } from '../components/ui/Stamp';

const HERO_IMAGE =
	'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1100&q=80';

export default function Signup() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const { signup } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			const res = await signup(username, email, password);
			if (res?.success) {
				toast.success('Welcome aboard.');
				navigate('/user-profile');
			} else {
				toast.error(res?.message || 'Sign up failed.');
			}
		} catch {
			toast.error('Something went wrong. Try again.');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
			<div className="relative hidden lg:block bg-paper-dim">
				<img
					src={HERO_IMAGE}
					alt="A live music event"
					className="absolute inset-0 w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-gradient-to-tr from-ink/55 via-ink/15 to-transparent" />
				<div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 h-full text-paper">
					<div className="font-display text-3xl font-semibold tracking-tight">Festify</div>
					<div className="space-y-3 max-w-md">
						<motion.h2
							initial={{ y: 16, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
							className="font-display font-medium leading-[1.05] tracking-tight"
							style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
						>
							Your front-row seat to the city.
						</motion.h2>
						<p className="font-sans text-base text-paper/85 leading-relaxed">
							Discover events, book tickets, host your own. All free. No platform fees, no middlemen.
						</p>
					</div>
				</div>
			</div>

			<div className="flex items-center justify-center px-5 sm:px-8 lg:px-12 py-14">
				<div className="w-full max-w-sm">
					<div className="font-sans text-sm font-medium text-accent-deep uppercase tracking-wider mb-3">
						Create account
					</div>
					<h1
						className="font-display font-medium leading-[1.02] tracking-tight mb-3"
						style={{ fontSize: 'clamp(2.25rem, 5vw, 3rem)' }}
					>
						Let's begin.
					</h1>
					<p className="font-sans text-base text-muted mb-10">
						Already in?{' '}
						<Link to="/login" className="text-ink underline underline-offset-4 decoration-accent decoration-2 hover:text-accent-deep">
							Log in
						</Link>
					</p>

					<form onSubmit={handleSubmit} className="space-y-5">
						<Input
							label="Name"
							type="text"
							required
							autoComplete="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Your name"
						/>
						<Input
							label="Email"
							type="email"
							required
							autoComplete="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
						/>
						<Input
							label="Password"
							type="password"
							required
							autoComplete="new-password"
							minLength={6}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="At least 6 characters"
							hint="6 characters minimum"
						/>
						<Button type="submit" variant="primary" size="lg" block disabled={submitting}>
							{submitting ? 'Creating…' : 'Create account'}
						</Button>
					</form>

					<div className="mt-8 pt-6 border-t border-line">
						<Stamp label="Free forever · No credit card" variant="info" size="sm" />
					</div>
				</div>
			</div>
		</div>
	);
}
