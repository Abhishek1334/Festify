import { Calendar, MapPin } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Stamp } from './Stamp';

export const Ticket = ({
	id,
	title,
	date,
	location,
	qr,
	state = 'active',
	accent,
	className,
	children,
}) => {
	const isCheckedIn = state === 'checked-in';
	const isExpired = state === 'expired';

	return (
		<div
			className={cn(
				'relative isolate flex bg-paper-card text-ink rounded-[var(--radius-lg)] overflow-hidden',
				'shadow-[var(--shadow-card)] border border-line/60',
				isExpired && 'opacity-60',
				className
			)}
		>
			{/* Perforation line */}
			<div className="pointer-events-none absolute inset-y-0 right-[28%] w-px border-l border-dashed border-line z-0" />
			{/* Notch holes */}
			<div className="pointer-events-none absolute right-[28%] -translate-x-1/2 -top-2.5 size-5 rounded-full bg-paper border border-line z-10" />
			<div className="pointer-events-none absolute right-[28%] -translate-x-1/2 -bottom-2.5 size-5 rounded-full bg-paper border border-line z-10" />

			{/* Main panel */}
			<div className="relative flex-1 p-5 sm:p-6 pr-7 z-[1]">
				<div className="flex items-center justify-between mb-3">
					<span className="font-sans text-xs font-medium text-muted">
						No. {id}
					</span>
					{accent && (
						<Stamp label={accent} variant="success" size="sm" />
					)}
				</div>
				{title && (
					<h3 className="font-display text-xl sm:text-2xl font-medium leading-snug tracking-tight mb-3 line-clamp-2">
						{title}
					</h3>
				)}
				<div className="space-y-1.5 text-sm text-muted">
					{date && (
						<div className="flex items-center gap-2">
							<Calendar className="size-3.5 text-accent shrink-0" strokeWidth={1.75} />
							<span>{date}</span>
						</div>
					)}
					{location && (
						<div className="flex items-center gap-2">
							<MapPin className="size-3.5 text-accent shrink-0" strokeWidth={1.75} />
							<span className="line-clamp-1">{location}</span>
						</div>
					)}
				</div>
				{children}
			</div>

			{/* Stub */}
			<div className="relative w-[28%] p-3 sm:p-4 flex flex-col items-center justify-between bg-paper-dim/60 z-[1]">
				{qr ? (
					<img
						src={qr}
						alt="QR"
						className="size-16 sm:size-18 rounded-md border border-line"
					/>
				) : (
					<div className="size-16 sm:size-18 grid place-items-center border border-dashed border-line rounded-md font-sans text-xs text-muted-soft">
						QR
					</div>
				)}
				<div className="font-sans text-[11px] font-medium text-muted text-center mt-3">
					Admit
					<br />
					one
				</div>
			</div>

			{isCheckedIn && (
				<div className="absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2 z-20">
					<Stamp label="Checked in" variant="live" rotation={-10} size="lg" dot />
				</div>
			)}
			{isExpired && (
				<div className="absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2 z-20">
					<Stamp label="Expired" variant="warn" rotation={-10} size="lg" />
				</div>
			)}
		</div>
	);
};
