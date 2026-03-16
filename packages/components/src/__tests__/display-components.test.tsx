import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Alert } from '../display/alert.js';
import { Badge } from '../display/badge.js';
import { Divider } from '../display/divider.js';
import { Link } from '../display/link.js';

afterEach(cleanup);

describe('Badge', () => {
	it('renders text', () => {
		render(<Badge text="Active" />);
		expect(screen.getByText('Active')).toBeTruthy();
	});

	it('applies color classes', () => {
		const { container } = render(<Badge text="Error" color="red" />);
		const span = container.querySelector('span');
		expect(span?.className).toContain('bg-red-100');
		expect(span?.className).toContain('text-red-700');
	});

	it('defaults to gray', () => {
		const { container } = render(<Badge text="Default" />);
		const span = container.querySelector('span');
		expect(span?.className).toContain('bg-gray-100');
	});

	it('applies custom className', () => {
		const { container } = render(<Badge text="Test" className="ml-2" />);
		const span = container.querySelector('span');
		expect(span?.className).toContain('ml-2');
	});
});

describe('Link', () => {
	it('renders with href and label', () => {
		render(<Link href="/about" label="About" />);
		const anchor = screen.getByText('About');
		expect(anchor.tagName).toBe('A');
		expect(anchor.getAttribute('href')).toBe('/about');
	});

	it('opens external links in new tab', () => {
		render(<Link href="https://example.com" label="External" external />);
		const anchor = screen.getByText('External');
		expect(anchor.getAttribute('target')).toBe('_blank');
		expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
	});

	it('does not set target for internal links', () => {
		render(<Link href="/internal" label="Internal" />);
		const anchor = screen.getByText('Internal');
		expect(anchor.getAttribute('target')).toBeNull();
	});
});

describe('Alert', () => {
	it('renders message', () => {
		render(<Alert message="Something happened" />);
		expect(screen.getByText('Something happened')).toBeTruthy();
	});

	it('renders title when provided', () => {
		render(<Alert message="Details here" title="Warning" type="warning" />);
		expect(screen.getByText('Warning')).toBeTruthy();
		expect(screen.getByText('Details here')).toBeTruthy();
	});

	it('has role="alert"', () => {
		render(<Alert message="Alert!" />);
		expect(screen.getByRole('alert')).toBeTruthy();
	});

	it('applies type-specific styles', () => {
		const { container } = render(<Alert message="Error occurred" type="error" />);
		const div = container.querySelector('[role="alert"]');
		expect(div?.className).toContain('border-red-200');
		expect(div?.className).toContain('bg-red-50');
	});

	it('defaults to info type', () => {
		const { container } = render(<Alert message="Info" />);
		const div = container.querySelector('[role="alert"]');
		expect(div?.className).toContain('border-blue-200');
	});
});

describe('Divider', () => {
	it('renders an hr element', () => {
		const { container } = render(<Divider />);
		const hr = container.querySelector('hr');
		expect(hr).toBeTruthy();
	});

	it('applies custom className', () => {
		const { container } = render(<Divider className="my-4" />);
		const hr = container.querySelector('hr');
		expect(hr?.className).toContain('my-4');
	});
});
