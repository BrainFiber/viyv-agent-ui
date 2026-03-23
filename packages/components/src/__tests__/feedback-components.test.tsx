import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Toast } from '../overlay/toast.js';
import { ToastContainer } from '../overlay/toast-container.js';

afterEach(cleanup);

describe('Toast', () => {
	it('renders message inside a ToastContainer', () => {
		render(
			<ToastContainer>
				<Toast message="保存しました" />
			</ToastContainer>,
		);
		expect(screen.getByText('保存しました')).toBeTruthy();
	});

	it('applies type styles', () => {
		const { container } = render(
			<ToastContainer>
				<Toast message="Error" type="error" />
			</ToastContainer>,
		);
		const el = container.querySelector('.bg-danger-soft') ?? document.querySelector('.bg-danger-soft');
		expect(el).toBeTruthy();
	});

	it('renders close button when closable', () => {
		render(
			<ToastContainer>
				<Toast message="Info" closable />
			</ToastContainer>,
		);
		expect(screen.getByLabelText('Close')).toBeTruthy();
	});

	it('does not render close button when closable is false', () => {
		render(
			<ToastContainer>
				<Toast message="Info" closable={false} />
			</ToastContainer>,
		);
		expect(screen.queryByLabelText('Close')).toBeNull();
	});
});

describe('ToastContainer', () => {
	it('renders children', () => {
		render(
			<ToastContainer>
				<div>child content</div>
			</ToastContainer>,
		);
		expect(screen.getByText('child content')).toBeTruthy();
	});

	it('renders viewport element', () => {
		render(<ToastContainer />);
		const viewport = document.querySelector('[role="region"]') ?? document.querySelector('ol');
		expect(viewport).toBeTruthy();
	});
});
