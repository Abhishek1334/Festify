import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import categories from '../categories.json';
import { cn } from '../lib/cn';

export default function Categories({ isHomepage }) {
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const [showAll, setShowAll] = useState(false);
	const selected = searchParams.get('category') || '';

	const list = showAll ? categories : categories.slice(0, 10);

	const handleSelect = (cat) => {
		if (isHomepage) {
			navigate(`/events?category=${cat}`);
			return;
		}
		setSearchParams((prev) => {
			const next = new URLSearchParams(prev);
			if (next.get('category') === cat) next.delete('category');
			else next.set('category', cat);
			return next;
		});
	};

	const chipClass = (active) =>
		cn(
			'px-4 py-2 rounded-full font-sans text-sm font-medium transition-colors border',
			active
				? 'bg-ink text-paper border-ink'
				: 'bg-paper-card text-ink border-line hover:border-ink hover:bg-paper-dim'
		);

	return (
		<section>
			<div className="flex flex-wrap gap-2">
				<button
					onClick={() => {
						setSearchParams((prev) => {
							const next = new URLSearchParams(prev);
							next.delete('category');
							return next;
						});
					}}
					className={chipClass(!selected)}
				>
					All
				</button>
				{list.map((c) => (
					<button
						key={c.name}
						onClick={() => handleSelect(c.category)}
						className={chipClass(selected === c.category)}
					>
						{c.name}
					</button>
				))}
				{categories.length > 10 && (
					<button
						onClick={() => setShowAll((v) => !v)}
						className="px-4 py-2 rounded-full font-sans text-sm font-medium border border-dashed border-muted text-muted hover:text-ink hover:border-ink"
					>
						{showAll ? 'Less' : `+ ${categories.length - 10} more`}
					</button>
				)}
			</div>
		</section>
	);
}

Categories.propTypes = {
	isHomepage: PropTypes.bool,
};
