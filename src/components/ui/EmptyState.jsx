import { CalendarOff, SearchX, Ticket as TicketIcon, Inbox } from 'lucide-react';
import { cn } from '../../lib/cn';

const ICONS = {
	default: Inbox,
	tickets: TicketIcon,
	events: CalendarOff,
	search: SearchX,
};

export const EmptyState = ({
	title,
	description,
	action,
	art = 'default',
	className,
}) => {
	const Icon = ICONS[art] || ICONS.default;
	return (
		<div
			className={cn(
				'flex flex-col items-center justify-center text-center py-16 px-4',
				className
			)}
		>
			<div className="size-14 grid place-items-center rounded-full bg-paper-dim mb-5">
				<Icon className="size-6 text-muted" strokeWidth={1.5} />
			</div>
			{title && (
				<h3 className="font-display text-2xl font-medium text-ink mb-2">{title}</h3>
			)}
			{description && (
				<p className="font-sans text-base text-muted max-w-sm mb-6 leading-relaxed">
					{description}
				</p>
			)}
			{action}
		</div>
	);
};
