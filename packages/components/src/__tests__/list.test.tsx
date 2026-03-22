import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { List } from '../data/list.js';

afterEach(cleanup);

describe('List', () => {
	const data = [
		{ name: 'Alice', email: 'alice@example.com' },
		{ name: 'Bob', email: 'bob@example.com' },
	];

	it('renders items with labelKey', () => {
		render(<List data={data} labelKey="name" />);
		expect(screen.getByText('Alice')).toBeTruthy();
		expect(screen.getByText('Bob')).toBeTruthy();
	});

	it('renders secondary text', () => {
		render(<List data={data} labelKey="name" secondaryKey="email" />);
		expect(screen.getByText('alice@example.com')).toBeTruthy();
	});

	it('renders empty message when data is empty', () => {
		render(<List data={[]} emptyMessage="No items" />);
		expect(screen.getByText('No items')).toBeTruthy();
	});

	it('has role="list" and role="listitem"', () => {
		render(<List data={data} labelKey="name" />);
		expect(screen.getByRole('list')).toBeTruthy();
		expect(screen.getAllByRole('listitem').length).toBe(2);
	});

	it('each item has aria-label', () => {
		render(<List data={data} labelKey="name" />);
		const items = screen.getAllByRole('listitem');
		expect(items[0].getAttribute('aria-label')).toBe('Alice');
	});

	it('renders ordered list when ordered=true', () => {
		const { container } = render(<List data={data} labelKey="name" ordered />);
		expect(container.querySelector('ol')).toBeTruthy();
	});
});
