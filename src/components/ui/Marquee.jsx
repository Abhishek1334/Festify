import { cn } from '../../lib/cn';

export const Marquee = ({ items, className, separator = '·', tone = 'dark' }) => {
	const repeated = [...items, ...items, ...items];
	const toneClass =
		tone === 'dark'
			? 'bg-ink text-paper'
			: tone === 'accent'
			? 'bg-accent text-paper'
			: 'bg-paper-dim text-ink';

	return (
		<div className={cn('relative flex overflow-hidden whitespace-nowrap', toneClass, className)}>
			<div className="animate-marquee flex shrink-0 items-center gap-8 py-2.5 pr-8">
				{repeated.map((item, i) => (
					<span
						key={i}
						className="inline-flex items-center gap-8 font-sans text-sm font-medium tracking-tight"
					>
						<span>{item}</span>
						<span aria-hidden className="opacity-50">
							{separator}
						</span>
					</span>
				))}
			</div>
		</div>
	);
};
