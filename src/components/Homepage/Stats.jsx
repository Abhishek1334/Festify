import { NumberTicker } from '../ui/NumberTicker';

const STATS = [
	{ value: 1240, label: 'Tickets stamped', suffix: '+' },
	{ value: 86, label: 'Events hosted' },
	{ value: 12, label: 'Cities live in' },
];

export default function Stats() {
	return (
		<section className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24">
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12">
				{STATS.map((s) => (
					<div key={s.label}>
						<div
							className="font-display font-medium tabular text-ink leading-none tracking-tight"
							style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}
						>
							<NumberTicker value={s.value} suffix={s.suffix || ''} />
						</div>
						<div className="mt-4 font-sans text-base text-muted">{s.label}</div>
					</div>
				))}
			</div>
		</section>
	);
}
