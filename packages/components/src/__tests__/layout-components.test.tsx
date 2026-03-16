import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Tabs } from '../layout/tabs.js';

afterEach(cleanup);

describe('Tabs', () => {
	const tabs = [
		{ id: 'tab1', label: 'First' },
		{ id: 'tab2', label: 'Second' },
		{ id: 'tab3', label: 'Third' },
	];

	it('renders tab buttons', () => {
		render(
			<Tabs tabs={tabs}>
				<div>Content 1</div>
				<div>Content 2</div>
				<div>Content 3</div>
			</Tabs>,
		);
		expect(screen.getByText('First')).toBeTruthy();
		expect(screen.getByText('Second')).toBeTruthy();
		expect(screen.getByText('Third')).toBeTruthy();
	});

	it('shows first tab content by default', () => {
		render(
			<Tabs tabs={tabs}>
				<div>Content 1</div>
				<div>Content 2</div>
				<div>Content 3</div>
			</Tabs>,
		);
		expect(screen.getByText('Content 1')).toBeTruthy();
		expect(screen.queryByText('Content 2')).toBeNull();
	});

	it('switches tab on click', () => {
		render(
			<Tabs tabs={tabs}>
				<div>Content 1</div>
				<div>Content 2</div>
				<div>Content 3</div>
			</Tabs>,
		);
		fireEvent.click(screen.getByText('Second'));
		expect(screen.queryByText('Content 1')).toBeNull();
		expect(screen.getByText('Content 2')).toBeTruthy();
	});

	it('sets aria-selected on active tab', () => {
		render(
			<Tabs tabs={tabs}>
				<div>Content 1</div>
				<div>Content 2</div>
			</Tabs>,
		);
		expect(screen.getByText('First').getAttribute('aria-selected')).toBe('true');
		expect(screen.getByText('Second').getAttribute('aria-selected')).toBe('false');

		fireEvent.click(screen.getByText('Second'));
		expect(screen.getByText('First').getAttribute('aria-selected')).toBe('false');
		expect(screen.getByText('Second').getAttribute('aria-selected')).toBe('true');
	});
});
