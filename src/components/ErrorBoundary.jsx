import { Component } from 'react';
import { Stamp } from './ui/Stamp';
import { Button } from './ui/Button';

export class ErrorBoundary extends Component {
	state = { hasError: false };

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error, info) {
		if (import.meta.env.DEV) {
			console.error('[festify] ErrorBoundary caught:', error, info);
		}
	}

	handleReload = () => {
		window.location.reload();
	};

	render() {
		if (!this.state.hasError) return this.props.children;

		return (
			<div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
				<Stamp
					label="TICKET MACHINE JAMMED"
					variant="warn"
					rotation={-6}
					size="lg"
					className="mb-10"
				/>
				<h1 className="font-sans text-3xl sm:text-4xl font-semibold mb-3">
					Something tore.
				</h1>
				<p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-8 max-w-xs">
					Try reloading. If it keeps happening, the back office has been
					notified.
				</p>
				<Button variant="primary" onClick={this.handleReload}>
					Reload page
				</Button>
			</div>
		);
	}
}
