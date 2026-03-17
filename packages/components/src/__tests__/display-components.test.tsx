import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Alert } from '../display/alert.js';
import { Badge } from '../display/badge.js';
import { Divider } from '../display/divider.js';
import { Image } from '../display/image.js';
import { Link } from '../display/link.js';
import { Text } from '../display/text.js';

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

describe('Alert closable', () => {
	it('shows close button when closable', () => {
		render(<Alert message="Closable" closable />);
		expect(screen.getByLabelText('Close')).toBeTruthy();
	});

	it('hides alert when close button is clicked', () => {
		render(<Alert message="Will hide" closable />);
		fireEvent.click(screen.getByLabelText('Close'));
		expect(screen.queryByText('Will hide')).toBeNull();
	});

	it('does not show close button by default', () => {
		render(<Alert message="Not closable" />);
		expect(screen.queryByLabelText('Close')).toBeNull();
	});
});

describe('Image', () => {
	it('renders with src and alt', () => {
		const { container } = render(<Image src="/test.png" alt="Test image" />);
		const img = container.querySelector('img');
		expect(img).toBeTruthy();
		expect(img?.getAttribute('src')).toBe('/test.png');
		expect(img?.getAttribute('alt')).toBe('Test image');
	});

	it('applies width and height', () => {
		const { container } = render(<Image src="/test.png" width={200} height={100} />);
		const img = container.querySelector('img');
		expect(img?.getAttribute('width')).toBe('200');
		expect(img?.getAttribute('height')).toBe('100');
	});

	it('applies default classes', () => {
		const { container } = render(<Image src="/test.png" />);
		const img = container.querySelector('img');
		expect(img?.className).toContain('max-w-full');
		expect(img?.className).toContain('rounded');
	});

	it('applies custom className', () => {
		const { container } = render(<Image src="/test.png" className="shadow-lg" />);
		const img = container.querySelector('img');
		expect(img?.className).toContain('shadow-lg');
	});
});

describe('Image objectFit', () => {
	it('applies objectFit="cover"', () => {
		const { container } = render(<Image src="/test.png" objectFit="cover" />);
		const img = container.querySelector('img');
		expect(img?.className).toContain('object-cover');
	});

	it('applies objectFit="contain"', () => {
		const { container } = render(<Image src="/test.png" objectFit="contain" />);
		const img = container.querySelector('img');
		expect(img?.className).toContain('object-contain');
	});

	it('does not add object- class when objectFit is omitted', () => {
		const { container } = render(<Image src="/test.png" />);
		const img = container.querySelector('img');
		expect(img?.className).not.toContain('object-');
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

describe('Text', () => {
	it('renders content', () => {
		render(<Text content="Hello" />);
		expect(screen.getByText('Hello')).toBeTruthy();
	});

	it('applies heading variant classes', () => {
		const { container } = render(<Text content="Title" variant="heading" />);
		const p = container.querySelector('p');
		expect(p?.className).toContain('text-xl');
		expect(p?.className).toContain('font-bold');
		expect(p?.className).toContain('text-gray-900');
	});

	it('applies caption variant classes', () => {
		const { container } = render(<Text content="Note" variant="caption" />);
		const p = container.querySelector('p');
		expect(p?.className).toContain('text-sm');
		expect(p?.className).toContain('font-normal');
		expect(p?.className).toContain('text-gray-500');
	});

	it('applies price variant classes', () => {
		const { container } = render(<Text content="$99" variant="price" />);
		const p = container.querySelector('p');
		expect(p?.className).toContain('text-lg');
		expect(p?.className).toContain('font-bold');
	});

	it('overrides variant defaults with individual props', () => {
		const { container } = render(
			<Text content="Custom" variant="heading" size="sm" weight="normal" color="muted" />,
		);
		const p = container.querySelector('p');
		expect(p?.className).toContain('text-sm');
		expect(p?.className).toContain('font-normal');
		expect(p?.className).toContain('text-gray-500');
	});

	it('applies truncate true', () => {
		const { container } = render(<Text content="Long text" truncate />);
		const p = container.querySelector('p');
		expect(p?.className).toContain('truncate');
	});

	it('applies truncate number (line-clamp)', () => {
		const { container } = render(<Text content="Multi-line" truncate={2} />);
		const p = container.querySelector('p');
		expect(p?.className).toContain('line-clamp-2');
	});

	it('applies custom className', () => {
		const { container } = render(<Text content="Styled" className="mt-4" />);
		const p = container.querySelector('p');
		expect(p?.className).toContain('mt-4');
	});

	it('applies color prop', () => {
		const { container } = render(<Text content="Danger" color="danger" />);
		const p = container.querySelector('p');
		expect(p?.className).toContain('text-red-600');
	});

	it('defaults to text-gray-700 without variant', () => {
		const { container } = render(<Text content="Default" />);
		const p = container.querySelector('p');
		expect(p?.className).toContain('text-gray-700');
	});
});
