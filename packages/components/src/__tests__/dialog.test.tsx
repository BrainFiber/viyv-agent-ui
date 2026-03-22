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

describe('Drawer', () => {
	it('renders with title', () => {
		render(<Drawer title="Details" />);
		expect(screen.getByText('Details')).toBeTruthy();
	});

	it('has role="dialog" and aria-modal', () => {
		render(<Drawer title="Test" />);
		const dialog = screen.getByRole('dialog');
		expect(dialog.getAttribute('aria-modal')).toBe('true');
	});

	it('title linked via aria-labelledby', () => {
		render(<Drawer title="Panel" />);
		const dialog = screen.getByRole('dialog');
		const labelledBy = dialog.getAttribute('aria-labelledby');
		expect(labelledBy).toBeTruthy();
		expect(document.getElementById(labelledBy!)?.textContent).toBe('Panel');
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
	it('shows tooltip on mouse enter', () => {
		render(
			<Tooltip content="Help text">
				<button type="button">Hover me</button>
			</Tooltip>,
		);
		expect(screen.queryByRole('tooltip')).toBeNull();
		fireEvent.mouseEnter(screen.getByText('Hover me').closest('span')!.parentElement!);
		expect(screen.getByRole('tooltip')).toBeTruthy();
		expect(screen.getByText('Help text')).toBeTruthy();
	});

	it('hides tooltip on mouse leave', () => {
		render(
			<Tooltip content="Tip">
				<span>Target</span>
			</Tooltip>,
		);
		const wrapper = screen.getByText('Target').closest('span')!.parentElement!;
		fireEvent.mouseEnter(wrapper);
		expect(screen.getByRole('tooltip')).toBeTruthy();
		fireEvent.mouseLeave(wrapper);
		expect(screen.queryByRole('tooltip')).toBeNull();
	});

	it('sets aria-describedby when visible', () => {
		render(
			<Tooltip content="Info">
				<span>Item</span>
			</Tooltip>,
		);
		const wrapper = screen.getByText('Item').closest('span')!.parentElement!;
		fireEvent.mouseEnter(wrapper);
		const tooltip = screen.getByRole('tooltip');
		const describedBy = screen.getByText('Item').closest('[aria-describedby]');
		expect(describedBy?.getAttribute('aria-describedby')).toBe(tooltip.id);
	});
});
