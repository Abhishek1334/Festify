import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiGithub } from 'react-icons/fi';

export default function Footer() {
	return (
		<footer className="bg-ink text-paper mt-12">
			<div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20">
				<div className="grid md:grid-cols-12 gap-10">
					<div className="md:col-span-5">
						<Link to="/" className="inline-block mb-5">
							<span className="font-display text-3xl font-semibold tracking-tight text-paper">
								Festify
							</span>
						</Link>
						<p className="font-sans text-base text-paper/70 leading-relaxed max-w-sm mb-7">
							Local events, real tickets. Discover what's on near you and walk in.
						</p>
						<div className="flex gap-2">
							<a
								href="https://github.com/AbhishekRajoria/Festify"
								target="_blank"
								rel="noreferrer"
								aria-label="GitHub"
								className="size-10 grid place-items-center rounded-full bg-paper/10 hover:bg-accent text-paper hover:text-paper transition-colors"
							>
								<FiGithub className="size-4" />
							</a>
							<a
								href="#"
								aria-label="Twitter"
								className="size-10 grid place-items-center rounded-full bg-paper/10 hover:bg-accent text-paper transition-colors"
							>
								<FiTwitter className="size-4" />
							</a>
							<a
								href="#"
								aria-label="Instagram"
								className="size-10 grid place-items-center rounded-full bg-paper/10 hover:bg-accent text-paper transition-colors"
							>
								<FiInstagram className="size-4" />
							</a>
						</div>
					</div>

					<div className="md:col-span-2">
						<h3 className="font-sans text-sm font-semibold text-paper mb-4">Browse</h3>
						<ul className="space-y-3 font-sans text-sm">
							<li>
								<Link to="/events" className="text-paper/65 hover:text-paper transition-colors">
									All events
								</Link>
							</li>
							<li>
								<Link to="/events?status=live" className="text-paper/65 hover:text-paper transition-colors">
									Live now
								</Link>
							</li>
							<li>
								<Link to="/events?status=upcoming" className="text-paper/65 hover:text-paper transition-colors">
									Upcoming
								</Link>
							</li>
						</ul>
					</div>

					<div className="md:col-span-2">
						<h3 className="font-sans text-sm font-semibold text-paper mb-4">Account</h3>
						<ul className="space-y-3 font-sans text-sm">
							<li>
								<Link to="/login" className="text-paper/65 hover:text-paper transition-colors">
									Log in
								</Link>
							</li>
							<li>
								<Link to="/signup" className="text-paper/65 hover:text-paper transition-colors">
									Sign up
								</Link>
							</li>
							<li>
								<Link to="/events/create-event" className="text-paper/65 hover:text-paper transition-colors">
									Host an event
								</Link>
							</li>
						</ul>
					</div>

					<div className="md:col-span-3">
						<h3 className="font-sans text-sm font-semibold text-paper mb-4">Built for</h3>
						<p className="font-sans text-sm text-paper/65 leading-relaxed">
							Crafted by{' '}
							<a
								href="https://github.com/AbhishekRajoria"
								target="_blank"
								rel="noreferrer"
								className="text-accent hover:text-paper transition-colors"
							>
								Abhishek Rajoria
							</a>
							. Available for landing-page commissions.
						</p>
					</div>
				</div>

				<div className="border-t border-paper/15 mt-14 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<p className="font-sans text-xs text-paper/45">
						© {new Date().getFullYear()} Festify. All rights reserved.
					</p>
					<p className="font-sans text-xs text-paper/45">
						Made in India 🇮🇳
					</p>
				</div>
			</div>
		</footer>
	);
}
