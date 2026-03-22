import { cleanup, fireEvent, render, screen, act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Toast } from '../overlay/toast.js';

afterEach(cleanup);

describe('Toast', () => {
	it('renders message', () => {
		render(<Toast message="保存しました" />);
		expect(screen.getByText('保存しました')).toBeTruthy();
	});

	it('has role="status" and aria-live="polite"', () => {
		render(<Toast message="Done" />);
		const el = screen.getByRole('status');
		expect(el.getAttribute('aria-live')).toBe('polite');
	});

	it('applies type styles', () => {
		const { container } = render(<Toast message="Error" type="error" />);
		const el = container.querySelector('[role="status"]');
		expect(el?.className).toContain('bg-danger-soft');
	});

	it('closes when close button clicked', () => {
		render(<Toast message="Info" closable />);
		expect(screen.getByText('Info')).toBeTruthy();
		fireEvent.click(screen.getByRole('button', { name: 'Close' }));
		expect(screen.queryByText('Info')).toBeNull();
	});

	it('auto-dismisses after duration', () => {
		vi.useFakeTimers();
		render(<Toast message="Bye" duration={3000} />);
		expect(screen.getByText('Bye')).toBeTruthy();
		act(() => { vi.advanceTimersByTime(3000); });
		expect(screen.queryByText('Bye')).toBeNull();
		vi.useRealTimers();
	});

	it('does not auto-dismiss when duration is 0', () => {
		vi.useFakeTimers();
		render(<Toast message="Stay" duration={0} />);
		vi.advanceTimersByTime(10000);
		expect(screen.getByText('Stay')).toBeTruthy();
		vi.useRealTimers();
	});
});
