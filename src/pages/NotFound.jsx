import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFound() {
	return (
		<div className="min-h-[70vh] flex flex-col items-center justify-center px-5 text-center">
			<div className="font-sans text-sm font-medium text-accent-deep uppercase tracking-wider mb-4">
				Error 404
			</div>
			<h1
				className="font-display font-medium leading-[1.02] tracking-tight mb-4"
				style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
			>
				Wrong door.
			</h1>
			<p className="font-sans text-lg text-muted max-w-md mb-9 leading-relaxed">
				This page doesn't exist or has been torn off the wall. Let's get you home.
			</p>
			<Link to="/">
				<Button variant="primary" size="lg">
					Back to Festify →
				</Button>
			</Link>
		</div>
	);
}
