import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Pagination } from '../navigation/pagination.js';

afterEach(cleanup);

describe('Pagination', () => {
	const defaultProps = {
		currentPage: 0,
		totalPages: 3,
		totalItems: 25,
		pageSize: 10,
		onPageChange: vi.fn(),
	};

	it('returns null when totalPages <= 1', () => {
		const { container } = render(
			<Pagination {...defaultProps} totalPages={1} totalItems={5} pageSize={10} />,
		);
		expect(container.innerHTML).toBe('');
	});

	it('shows correct item range text', () => {
		render(<Pagination {...defaultProps} />);
		expect(screen.getByText(/25件中 1–10件/)).toBeTruthy();
	});

	it('shows correct range for middle page', () => {
		render(<Pagination {...defaultProps} currentPage={1} />);
		expect(screen.getByText(/25件中 11–20件/)).toBeTruthy();
	});

	it('shows correct range for last page', () => {
		render(<Pagination {...defaultProps} currentPage={2} />);
		expect(screen.getByText(/25件中 21–25件/)).toBeTruthy();
	});

	it('disables 前へ button on first page', () => {
		render(<Pagination {...defaultProps} currentPage={0} />);
		const prevBtn = screen.getByText('前へ') as HTMLButtonElement;
		expect(prevBtn.disabled).toBe(true);
	});

	it('disables 次へ button on last page', () => {
		render(<Pagination {...defaultProps} currentPage={2} />);
		const nextBtn = screen.getByText('次へ') as HTMLButtonElement;
		expect(nextBtn.disabled).toBe(true);
	});

	it('enables both buttons on middle page', () => {
		render(<Pagination {...defaultProps} currentPage={1} />);
		expect((screen.getByText('前へ') as HTMLButtonElement).disabled).toBe(false);
		expect((screen.getByText('次へ') as HTMLButtonElement).disabled).toBe(false);
	});

	it('calls onPageChange with previous page when 前へ clicked', () => {
		const onPageChange = vi.fn();
		render(<Pagination {...defaultProps} currentPage={1} onPageChange={onPageChange} />);
		fireEvent.click(screen.getByText('前へ'));
		expect(onPageChange).toHaveBeenCalledWith(0);
	});

	it('calls onPageChange with next page when 次へ clicked', () => {
		const onPageChange = vi.fn();
		render(<Pagination {...defaultProps} currentPage={0} onPageChange={onPageChange} />);
		fireEvent.click(screen.getByText('次へ'));
		expect(onPageChange).toHaveBeenCalledWith(1);
	});

	it('shows page number indicator', () => {
		render(<Pagination {...defaultProps} currentPage={1} />);
		expect(screen.getByText('2 / 3')).toBeTruthy();
	});
});
