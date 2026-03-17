import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Dialog } from '../overlay/dialog.js';

afterEach(cleanup);

describe('Dialog', () => {
	it('renders with title', () => {
		render(<Dialog title="確認" />);
		expect(screen.getByText('確認')).toBeTruthy();
	});

	it('has role="dialog"', () => {
		render(<Dialog title="Test" />);
		expect(screen.getByRole('dialog')).toBeTruthy();
	});

	it('has aria-modal="true"', () => {
		render(<Dialog title="Test" />);
		const dialog = screen.getByRole('dialog');
		expect(dialog.getAttribute('aria-modal')).toBe('true');
	});

	it('title linked via aria-labelledby', () => {
		render(<Dialog title="My Title" />);
		const dialog = screen.getByRole('dialog');
		const labelledBy = dialog.getAttribute('aria-labelledby');
		expect(labelledBy).toBeTruthy();
		const heading = document.getElementById(labelledBy!);
		expect(heading?.textContent).toBe('My Title');
	});

	it('renders children', () => {
		render(
			<Dialog title="Test">
				<p>Child content</p>
			</Dialog>,
		);
		expect(screen.getByText('Child content')).toBeTruthy();
	});

	it('renders backdrop', () => {
		const { container } = render(<Dialog title="Test" />);
		const backdrop = container.querySelector('[aria-hidden="true"]');
		expect(backdrop).toBeTruthy();
		expect(backdrop?.className).toContain('bg-black/50');
	});

	it('applies custom className', () => {
		render(<Dialog title="Test" className="max-w-lg" />);
		const dialog = screen.getByRole('dialog');
		expect(dialog.className).toContain('max-w-lg');
	});
});
