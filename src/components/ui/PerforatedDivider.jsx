import { cn } from '../../lib/cn';

export const PerforatedDivider = ({ label, className }) => (
	<div className={cn('relative flex items-center gap-4 my-12 sm:my-20', className)}>
		<div className="flex-1 border-t border-line" />
		{label && (
			<span className="font-sans text-sm font-medium text-muted uppercase tracking-wider px-2">
				{label}
			</span>
		)}
		<div className="flex-1 border-t border-line" />
	</div>
);
