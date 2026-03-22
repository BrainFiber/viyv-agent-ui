import React from 'react';

export interface ElementErrorBoundaryProps {
	elementId: string;
	elementType: string;
	children: React.ReactNode;
}

interface ErrorBoundaryState {
	error: Error | null;
}

export class ElementErrorBoundary extends React.Component<ElementErrorBoundaryProps, ErrorBoundaryState> {
	override state: ErrorBoundaryState = { error: null };

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { error };
	}

	override componentDidCatch(error: Error, info: React.ErrorInfo) {
		console.error(
			`[agent-ui] Error in element "${this.props.elementId}" (${this.props.elementType}):`,
			error,
			info.componentStack,
		);
	}

	override render() {
		if (this.state.error) {
			return (
				<div
					role="alert"
					style={{
						padding: '1rem',
						border: '1px solid #fca5a5',
						borderRadius: '0.375rem',
						backgroundColor: '#fef2f2',
						color: '#dc2626',
						fontSize: '0.875rem',
					}}
				>
					<p style={{ fontWeight: 500 }}>Component error</p>
					<p style={{ marginTop: '0.25rem', color: '#6b7280' }}>{this.state.error.message}</p>
				</div>
			);
		}
		return this.props.children;
	}
}
