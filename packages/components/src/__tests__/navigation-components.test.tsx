import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Breadcrumbs } from '../navigation/breadcrumbs.js';
import { Menu } from '../navigation/menu.js';
import { Stepper } from '../navigation/stepper.js';

afterEach(cleanup);

describe('Breadcrumbs', () => {
	const items = [
		{ label: 'Home', href: '/' },
		{ label: 'Products', href: '/products' },
		{ label: 'Detail' },
	];

	it('renders all items', () => {
		render(<Breadcrumbs items={items} />);
		expect(screen.getByText('Home')).toBeTruthy();
		expect(screen.getByText('Products')).toBeTruthy();
		expect(screen.getByText('Detail')).toBeTruthy();
	});

	it('has nav with aria-label="Breadcrumb"', () => {
		render(<Breadcrumbs items={items} />);
		expect(screen.getByLabelText('Breadcrumb')).toBeTruthy();
	});

	it('last item has aria-current="page"', () => {
		render(<Breadcrumbs items={items} />);
		expect(screen.getByText('Detail').getAttribute('aria-current')).toBe('page');
	});

	it('non-last items with href are links', () => {
		render(<Breadcrumbs items={items} />);
		const link = screen.getByText('Home') as HTMLAnchorElement;
		expect(link.tagName).toBe('A');
		expect(link.href).toContain('/');
	});

	it('last item is not a link', () => {
		render(<Breadcrumbs items={items} />);
		expect(screen.getByText('Detail').tagName).not.toBe('A');
	});

	it('renders separator between items', () => {
		const { container } = render(<Breadcrumbs items={items} separator=">" />);
		const separators = container.querySelectorAll('[aria-hidden="true"]');
		expect(separators.length).toBe(2);
		expect(separators[0].textContent).toBe('>');
	});

	it('returns null for empty items', () => {
		const { container } = render(<Breadcrumbs items={[]} />);
		expect(container.innerHTML).toBe('');
	});
});

describe('Stepper', () => {
	const steps = [
		{ label: 'Step 1', description: 'First step' },
		{ label: 'Step 2' },
		{ label: 'Step 3' },
	];

	it('renders all step labels', () => {
		render(<Stepper steps={steps} current={0} />);
		expect(screen.getByText('Step 1')).toBeTruthy();
		expect(screen.getByText('Step 2')).toBeTruthy();
		expect(screen.getByText('Step 3')).toBeTruthy();
	});

	it('renders description', () => {
		render(<Stepper steps={steps} current={0} />);
		expect(screen.getByText('First step')).toBeTruthy();
	});

	it('has role="group" with aria-label', () => {
		render(<Stepper steps={steps} current={1} />);
		expect(screen.getByRole('group').getAttribute('aria-label')).toBe('Progress steps');
	});

	it('marks current step with aria-current="step"', () => {
		render(<Stepper steps={steps} current={1} />);
		const currentStep = screen.getByText('Step 2').closest('[aria-current]');
		expect(currentStep?.getAttribute('aria-current')).toBe('step');
	});

	it('completed steps show checkmark', () => {
		render(<Stepper steps={steps} current={2} />);
		const badges = document.querySelectorAll('.rounded-full');
		expect(badges[0].querySelector('svg')).toBeTruthy();
		expect(badges[1].querySelector('svg')).toBeTruthy();
		expect(badges[2].textContent).toBe('3');
	});
});

describe('Menu', () => {
	const items = [
		{ label: 'Home', href: '/', active: true },
		{ label: 'Products', href: '/products' },
		{ label: 'Settings', items: [{ label: 'Profile', href: '/settings/profile' }] },
	];

	it('renders all top-level items', () => {
		render(<Menu items={items} />);
		expect(screen.getByText('Home')).toBeTruthy();
		expect(screen.getByText('Products')).toBeTruthy();
		expect(screen.getByText('Settings')).toBeTruthy();
	});

	it('has nav with role="navigation"', () => {
		render(<Menu items={items} />);
		expect(screen.getByRole('navigation')).toBeTruthy();
	});

	it('marks active item with aria-current="page"', () => {
		render(<Menu items={items} />);
		const homeLink = screen.getByText('Home').closest('a');
		expect(homeLink?.getAttribute('aria-current')).toBe('page');
	});

	it('expands sub-items on click', () => {
		render(<Menu items={items} />);
		expect(screen.queryByText('Profile')).toBeNull();
		fireEvent.click(screen.getByText('Settings'));
		expect(screen.getByText('Profile')).toBeTruthy();
	});

	it('sets aria-expanded on parent with children', () => {
		render(<Menu items={items} />);
		const btn = screen.getByText('Settings').closest('button');
		expect(btn?.getAttribute('aria-expanded')).toBe('false');
		fireEvent.click(btn!);
		expect(btn?.getAttribute('aria-expanded')).toBe('true');
	});
});
