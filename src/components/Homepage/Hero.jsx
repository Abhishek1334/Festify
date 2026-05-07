import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import { Stamp } from '../ui/Stamp';

const reveal = {
	hidden: { y: 16, opacity: 0 },
	show: (i = 0) => ({
		y: 0,
		opacity: 1,
		transition: { duration: 0.6, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] },
	}),
};

const HERO_IMAGE =
	'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1400&q=80';

export default function Hero() {
	return (
		<section className="relative max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 pt-10 sm:pt-16 pb-10 sm:pb-16">
			<div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)] gap-10 lg:gap-16 items-center">
				<div className="relative z-10">
					<motion.div
						initial="hidden"
						animate="show"
						variants={reveal}
						custom={0}
						className="mb-7"
					>
						<Stamp
							label="Now booking events near you"
							variant="info"
							dot
							size="md"
						/>
					</motion.div>

					<motion.h1
						initial="hidden"
						animate="show"
						variants={reveal}
						custom={1}
						className="font-display font-medium text-ink leading-[1.02] tracking-tight"
						style={{ fontSize: 'clamp(2.75rem, 7vw, 5.5rem)' }}
					>
						The events
						<br />
						nearest you,
						<br />
						<span className="italic text-accent-deep" style={{ fontVariationSettings: '"SOFT" 100' }}>
							tonight.
						</span>
					</motion.h1>

					<motion.p
						initial="hidden"
						animate="show"
						variants={reveal}
						custom={3}
						className="mt-7 max-w-[500px] font-sans text-lg text-ink/80 leading-[1.55]"
					>
						Discover gigs, food markets, art shows and meetups happening
						in your city this week. Book a ticket. Walk in.
					</motion.p>

					<motion.div
						initial="hidden"
						animate="show"
						variants={reveal}
						custom={5}
						className="mt-9 flex flex-wrap items-center gap-3"
					>
						<Link to="/events">
							<Button variant="primary" size="lg">
								Browse events <ArrowRight className="size-4" />
							</Button>
						</Link>
						<Link to="/events/create-event">
							<Button variant="secondary" size="lg">
								Host an event
							</Button>
						</Link>
					</motion.div>

					<motion.div
						initial="hidden"
						animate="show"
						variants={reveal}
						custom={7}
						className="mt-10 flex items-center gap-3 text-muted text-sm"
					>
						<MapPin className="size-4 text-accent" strokeWidth={1.75} />
						<span>Live in 12+ cities · Bengaluru · Mumbai · Delhi · …</span>
					</motion.div>
				</div>

				{/* Photo */}
				<motion.div
					initial={{ opacity: 0, scale: 0.96 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
					className="relative"
				>
					<div className="relative aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-paper-dim shadow-[var(--shadow-card-hover)]">
						<img
							src={HERO_IMAGE}
							alt="A festival crowd at golden hour"
							className="w-full h-full object-cover"
							loading="eager"
							fetchPriority="high"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
						<motion.div
							initial={{ y: 12, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.7, duration: 0.6 }}
							className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3"
						>
							<div className="bg-paper/95 backdrop-blur-sm rounded-[var(--radius)] px-4 py-3 shadow-[var(--shadow-card)]">
								<div className="font-sans text-xs font-medium text-accent-deep mb-0.5">
									Featured · this weekend
								</div>
								<div className="font-display text-lg font-medium text-ink leading-tight">
									Kashmere Fest, BLR
								</div>
							</div>
							<div className="bg-accent text-paper rounded-full size-12 grid place-items-center shadow-[var(--shadow-button)] shrink-0">
								<ArrowRight className="size-5" />
							</div>
						</motion.div>
					</div>

					{/* Floating mini stamp */}
					<motion.div
						initial={{ rotate: -8, scale: 0.6, opacity: 0 }}
						animate={{ rotate: -8, scale: 1, opacity: 1 }}
						transition={{ delay: 1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
						className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4"
					>
						<Stamp label="Live · 24 events" variant="live" dot size="lg" rotation={-6} />
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
