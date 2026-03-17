import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Avatar } from '../display/avatar.js';

afterEach(cleanup);

describe('Avatar', () => {
	it('renders image with src', () => {
		render(<Avatar src="https://example.com/photo.jpg" name="Alice" />);
		const img = screen.getByRole('img');
		expect(img.tagName).toBe('IMG');
		expect(img.getAttribute('alt')).toBe('Alice');
		expect(img.getAttribute('src')).toBe('https://example.com/photo.jpg');
	});

	it('shows initials when no src', () => {
		render(<Avatar name="Bob" />);
		expect(screen.getByText('B')).toBeTruthy();
	});

	it('applies size classes', () => {
		const { container: smContainer } = render(<Avatar name="A" size="sm" />);
		const sm = smContainer.querySelector('span');
		expect(sm?.className).toContain('w-8');
		expect(sm?.className).toContain('h-8');

		cleanup();

		const { container: lgContainer } = render(<Avatar name="A" size="lg" />);
		const lg = lgContainer.querySelector('span');
		expect(lg?.className).toContain('w-12');
		expect(lg?.className).toContain('h-12');
	});

	it('has aria-label', () => {
		render(<Avatar name="Charlie" />);
		expect(screen.getByLabelText('Charlie')).toBeTruthy();
	});

	it('deterministic color from name', () => {
		const { container: c1 } = render(<Avatar name="Test" />);
		const cls1 = c1.querySelector('span')?.className;
		cleanup();
		const { container: c2 } = render(<Avatar name="Test" />);
		const cls2 = c2.querySelector('span')?.className;
		expect(cls1).toBe(cls2);
	});

	it('applies custom className', () => {
		const { container } = render(<Avatar name="Test" className="ml-4" />);
		const span = container.querySelector('span');
		expect(span?.className).toContain('ml-4');
	});

	it('falls back to initials on image error', () => {
		render(<Avatar src="https://example.com/broken.jpg" name="Alice" />);
		const img = screen.getByRole('img');
		fireEvent.error(img);
		expect(screen.getByText('A')).toBeTruthy();
		expect(screen.queryByRole('img')).toBeNull();
	});

	it('treats empty string src as no image', () => {
		render(<Avatar src="" name="Dave" />);
		expect(screen.queryByRole('img')).toBeNull();
		expect(screen.getByText('D')).toBeTruthy();
	});
});
