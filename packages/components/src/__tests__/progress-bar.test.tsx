import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { ProgressBar } from '../display/progress-bar.js';

afterEach(cleanup);

describe('ProgressBar', () => {
	it('renders with correct width', () => {
		const { container } = render(<ProgressBar value={60} />);
		const fill = container.querySelector('[role="progressbar"] > div');
		expect(fill?.getAttribute('style')).toContain('width: 60%');
	});

	it('applies color classes', () => {
		const expectedMap: Record<string, string> = {
			blue: 'bg-primary',
			green: 'bg-success',
			yellow: 'bg-warning',
			red: 'bg-danger',
			gray: 'bg-fg-subtle',
		};
		for (const color of ['blue', 'green', 'yellow', 'red', 'gray'] as const) {
			cleanup();
			const { container } = render(<ProgressBar value={50} color={color} />);
			const fill = container.querySelector('[role="progressbar"] > div');
			expect(fill?.className).toContain(expectedMap[color]);
		}
	});

	it('applies size classes', () => {
		const sizeMap = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
		for (const [size, cls] of Object.entries(sizeMap)) {
			cleanup();
			const { container } = render(<ProgressBar value={50} size={size as 'sm' | 'md' | 'lg'} />);
			const track = container.querySelector('[role="progressbar"]');
			expect(track?.className).toContain(cls);
		}
	});

	it('shows value when showValue is true', () => {
		render(<ProgressBar value={75} showValue />);
		expect(screen.getByText('75%')).toBeTruthy();
	});

	it('has progressbar role and aria attributes', () => {
		render(<ProgressBar value={42} label="Upload progress" />);
		const bar = screen.getByRole('progressbar');
		expect(bar).toBeTruthy();
		expect(bar.getAttribute('aria-valuenow')).toBe('42');
		expect(bar.getAttribute('aria-valuemin')).toBe('0');
		expect(bar.getAttribute('aria-valuemax')).toBe('100');
		expect(bar.getAttribute('aria-label')).toBe('Upload progress');
	});

	it('clamps value to 0-100', () => {
		const { container: c1 } = render(<ProgressBar value={-10} />);
		const fill1 = c1.querySelector('[role="progressbar"] > div');
		expect(fill1?.getAttribute('style')).toContain('width: 0%');

		cleanup();

		const { container: c2 } = render(<ProgressBar value={150} />);
		const fill2 = c2.querySelector('[role="progressbar"] > div');
		expect(fill2?.getAttribute('style')).toContain('width: 100%');
	});

	it('applies custom className', () => {
		const { container } = render(<ProgressBar value={50} className="mt-4" />);
		const wrapper = container.firstElementChild;
		expect(wrapper?.className).toContain('mt-4');
	});

	it('handles NaN value gracefully', () => {
		const { container } = render(<ProgressBar value={NaN} />);
		const bar = container.querySelector('[role="progressbar"]');
		expect(bar?.getAttribute('aria-valuenow')).toBe('0');
	});

	it('handles aggregate array value', () => {
		// useDerived aggregate returns [{ key_fn: value }]
		const { container } = render(<ProgressBar value={[{ progress_avg: 65 }] as any} />);
		const fill = container.querySelector('[role="progressbar"] > div');
		expect(fill?.getAttribute('style')).toContain('width: 65%');
	});
});
