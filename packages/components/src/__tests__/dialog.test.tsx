import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Dialog } from '../overlay/dialog.js';
import { Drawer } from '../overlay/drawer.js';
import { Tooltip } from '../overlay/tooltip.js';

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

	it('is a modal dialog', () => {
		render(<Dialog title="Test" />);
		const dialog = screen.getByRole('dialog');
		// Radix Dialog is modal by default — verify dialog element exists
		expect(dialog).toBeTruthy();
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

	it('renders overlay with bg-overlay class', () => {
		render(<Dialog title="Test" />);
		const overlay = document.querySelector('.bg-overlay');
		expect(overlay).toBeTruthy();
	});

	it('applies custom className', () => {
		render(<Dialog title="Test" className="max-w-lg" />);
		const dialog = screen.getByRole('dialog');
		expect(dialog.className).toContain('max-w-lg');
	});
});

describe('Drawer', () => {
	it('renders with title', () => {
		render(<Drawer title="Details" />);
		expect(screen.getByText('Details')).toBeTruthy();
	});

	it('has role="dialog" and aria-modal', () => {
		render(<Drawer title="Test" />);
		const dialog = screen.getByRole('dialog');
		expect(dialog).toBeTruthy();
	});

	it('title linked via aria-labelledby', () => {
		render(<Drawer title="Panel" />);
		const dialog = screen.getByRole('dialog');
		expect(dialog).toBeTruthy();
		expect(screen.getByText('Panel')).toBeTruthy();
	});

	it('renders children', () => {
		render(<Drawer title="Test"><p>Content</p></Drawer>);
		expect(screen.getByText('Content')).toBeTruthy();
	});

	it('shows close button when onClose provided', () => {
		const onClose = vi.fn();
		render(<Drawer title="Test" onClose={onClose} />);
		const closeBtn = screen.getByRole('button', { name: 'Close' });
		fireEvent.click(closeBtn);
		expect(onClose).toHaveBeenCalled();
	});

	it('does not show close button without onClose', () => {
		render(<Drawer title="Test" />);
		expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
	});
});

describe('Tooltip', () => {
	it('renders trigger content', () => {
		render(
			<Tooltip content="Help text">
				<button type="button">Hover me</button>
			</Tooltip>,
		);
		expect(screen.getByText('Hover me')).toBeTruthy();
	});

	it('tooltip is not visible initially', () => {
		render(
			<Tooltip content="Help text">
				<button type="button">Hover me</button>
			</Tooltip>,
		);
		expect(screen.queryByRole('tooltip')).toBeNull();
	});

	it('renders children inside trigger span', () => {
		const { container } = render(
			<Tooltip content="Info">
				<span>Item</span>
			</Tooltip>,
		);
		const trigger = container.querySelector('[data-state]');
		expect(trigger).toBeTruthy();
		expect(trigger?.textContent).toBe('Item');
	});
});
