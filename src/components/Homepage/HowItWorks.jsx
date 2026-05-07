import { motion } from 'framer-motion';
import { Compass, Ticket as TicketIcon, ScanLine } from 'lucide-react';

const STEPS = [
	{
		index: '01',
		icon: Compass,
		title: 'Discover',
		description:
			"Browse what's happening in your city — gigs, food markets, art shows, meetups. Filtered by what you actually care about.",
	},
	{
		index: '02',
		icon: TicketIcon,
		title: 'Book',
		description:
			'Reserve a seat in seconds. Get a QR-stamped ticket on your profile — works offline at the door.',
	},
	{
		index: '03',
		icon: ScanLine,
		title: 'Walk in',
		description:
			'Show the QR or tap a wristband at the door. Organizer scans, you are in. No app needed.',
	},
];

export default function HowItWorks() {
	return (
		<section className="bg-paper-dim/60">
			<div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24">
				<div className="max-w-2xl mb-14">
					<div className="font-sans text-sm font-medium text-accent-deep uppercase tracking-wider mb-3">
						How it works
					</div>
					<h2
						className="font-display font-medium leading-[1.05] tracking-tight"
						style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
					>
						Three steps. No middleman, no platform fees.
					</h2>
				</div>

				<div className="grid md:grid-cols-3 gap-6 md:gap-8">
					{STEPS.map((step, i) => (
						<motion.div
							key={step.index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-40px' }}
							transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
							className="bg-paper-card rounded-[var(--radius-lg)] p-7 sm:p-8 border border-line/60"
						>
							<div className="flex items-center justify-between mb-7">
								<span className="font-display text-3xl font-medium text-accent-deep tracking-tight">
									{step.index}
								</span>
								<div className="size-11 rounded-full bg-accent-soft grid place-items-center">
									<step.icon className="size-5 text-accent-deep" strokeWidth={1.75} />
								</div>
							</div>
							<h3 className="font-display text-2xl sm:text-3xl font-medium leading-tight mb-3 tracking-tight">
								{step.title}
							</h3>
							<p className="font-sans text-base text-muted leading-relaxed">
								{step.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
