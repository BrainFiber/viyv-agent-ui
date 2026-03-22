import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Calendar } from '../display/calendar.js';

afterEach(cleanup);

describe('Calendar', () => {
	it('renders month grid with role="grid"', () => {
		render(<Calendar defaultMonth="2024-03" />);
		expect(screen.getByRole('grid')).toBeTruthy();
	});

	it('renders weekday headers', () => {
		render(<Calendar defaultMonth="2024-03" />);
		expect(screen.getByText('日')).toBeTruthy();
		expect(screen.getByText('月')).toBeTruthy();
		expect(screen.getByText('土')).toBeTruthy();
	});

	it('renders correct number of day cells', () => {
		render(<Calendar defaultMonth="2024-03" />);
		// March 2024 has 31 days
		expect(screen.getAllByRole('gridcell').length).toBe(31);
	});

	it('navigates to previous month', () => {
		render(<Calendar defaultMonth="2024-03" />);
		expect(screen.getByText('2024年3月')).toBeTruthy();
		fireEvent.click(screen.getByLabelText('Previous month'));
		expect(screen.getByText('2024年2月')).toBeTruthy();
	});

	it('navigates to next month', () => {
		render(<Calendar defaultMonth="2024-12" />);
		fireEvent.click(screen.getByLabelText('Next month'));
		expect(screen.getByText('2025年1月')).toBeTruthy();
	});

	it('calls onDateClick with date string', () => {
		const onDateClick = vi.fn();
		render(<Calendar defaultMonth="2024-03" onDateClick={onDateClick} />);
		fireEvent.click(screen.getByLabelText('3月15日'));
		expect(onDateClick).toHaveBeenCalledWith('2024-03-15');
	});

	it('renders event markers', () => {
		const events = [{ date: '2024-03-10', label: 'Meeting' }];
		render(<Calendar defaultMonth="2024-03" events={events} />);
		expect(screen.getByLabelText('3月10日 (Meeting)')).toBeTruthy();
	});
});
