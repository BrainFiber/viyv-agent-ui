import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Checkbox } from '../input/checkbox.js';
import { RadioGroup } from '../input/radio-group.js';
import { Select } from '../input/select.js';
import { TextInput } from '../input/text-input.js';
import { Textarea } from '../input/textarea.js';

afterEach(cleanup);

describe('TextInput', () => {
	it('renders error message', () => {
		render(<TextInput error="必須です" />);
		expect(screen.getByRole('alert').textContent).toBe('必須です');
	});

	it('applies aria-invalid when error', () => {
		render(<TextInput error="必須です" />);
		const input = document.querySelector('input')!;
		expect(input.getAttribute('aria-invalid')).toBe('true');
	});

	it('does not show error when empty string', () => {
		render(<TextInput error="" />);
		expect(screen.queryByRole('alert')).toBeNull();
		const input = document.querySelector('input')!;
		expect(input.getAttribute('aria-invalid')).toBe('false');
	});

	it('links error via aria-describedby', () => {
		render(<TextInput error="bad" />);
		const input = document.querySelector('input')!;
		const describedBy = input.getAttribute('aria-describedby');
		expect(describedBy).toBeTruthy();
		expect(document.getElementById(describedBy!)?.textContent).toBe('bad');
	});
});

describe('Textarea', () => {
	it('renders with label', () => {
		render(<Textarea label="Message" />);
		expect(screen.getByText('Message')).toBeTruthy();
	});

	it('renders placeholder', () => {
		render(<Textarea placeholder="Enter text" />);
		expect(screen.getByPlaceholderText('Enter text')).toBeTruthy();
	});

	it('calls onChange with value', () => {
		const onChange = vi.fn();
		render(<Textarea onChange={onChange} />);
		const textarea = document.querySelector('textarea')!;
		fireEvent.change(textarea, { target: { value: 'hello' } });
		expect(onChange).toHaveBeenCalledWith('hello');
	});

	it('renders with specified rows', () => {
		render(<Textarea rows={5} />);
		const textarea = document.querySelector('textarea')!;
		expect(textarea.getAttribute('rows')).toBe('5');
	});

	it('defaults to 3 rows', () => {
		render(<Textarea />);
		const textarea = document.querySelector('textarea')!;
		expect(textarea.getAttribute('rows')).toBe('3');
	});

	it('applies disabled state', () => {
		render(<Textarea disabled />);
		const textarea = document.querySelector('textarea')!;
		expect(textarea.disabled).toBe(true);
	});

	it('applies custom className', () => {
		const { container } = render(<Textarea className="mt-4" />);
		const label = container.querySelector('label');
		expect(label?.className).toContain('mt-4');
	});

	it('renders error message', () => {
		render(<Textarea error="入力してください" />);
		expect(screen.getByRole('alert').textContent).toBe('入力してください');
	});

	it('applies aria-invalid when error', () => {
		render(<Textarea error="エラー" />);
		const textarea = document.querySelector('textarea')!;
		expect(textarea.getAttribute('aria-invalid')).toBe('true');
	});

	it('does not show error when empty string', () => {
		render(<Textarea error="" />);
		expect(screen.queryByRole('alert')).toBeNull();
	});
});

describe('Select', () => {
	const options = [
		{ value: 'a', label: 'A' },
		{ value: 'b', label: 'B' },
	];

	it('renders error message', () => {
		render(<Select options={options} error="選択してください" />);
		expect(screen.getByRole('alert').textContent).toBe('選択してください');
	});

	it('applies aria-invalid when error', () => {
		render(<Select options={options} error="エラー" />);
		const select = document.querySelector('select')!;
		expect(select.getAttribute('aria-invalid')).toBe('true');
	});

	it('does not show error when empty string', () => {
		render(<Select options={options} error="" />);
		expect(screen.queryByRole('alert')).toBeNull();
	});
});

describe('Checkbox', () => {
	it('renders with label', () => {
		render(<Checkbox label="Agree" />);
		expect(screen.getByText('Agree')).toBeTruthy();
	});

	it('calls onChange with boolean', () => {
		const onChange = vi.fn();
		render(<Checkbox label="Toggle" onChange={onChange} />);
		const input = document.querySelector('input[type="checkbox"]')!;
		fireEvent.click(input);
		expect(onChange).toHaveBeenCalledWith(true);
	});

	it('reflects checked state', () => {
		render(<Checkbox checked />);
		const input = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
		expect(input.checked).toBe(true);
	});

	it('applies disabled state', () => {
		render(<Checkbox disabled />);
		const input = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
		expect(input.disabled).toBe(true);
	});

	it('applies custom className', () => {
		const { container } = render(<Checkbox className="ml-2" />);
		const wrapper = container.firstElementChild;
		expect(wrapper?.className).toContain('ml-2');
	});

	it('renders error message', () => {
		render(<Checkbox error="同意が必要です" />);
		expect(screen.getByRole('alert').textContent).toBe('同意が必要です');
	});

	it('applies aria-invalid when error', () => {
		render(<Checkbox error="エラー" />);
		const input = document.querySelector('input[type="checkbox"]')!;
		expect(input.getAttribute('aria-invalid')).toBe('true');
	});

	it('does not show error when empty string', () => {
		render(<Checkbox error="" />);
		expect(screen.queryByRole('alert')).toBeNull();
	});
});

describe('RadioGroup', () => {
	const options = [
		{ value: 'a', label: 'Option A' },
		{ value: 'b', label: 'Option B' },
		{ value: 'c', label: 'Option C' },
	];

	it('renders all options', () => {
		render(<RadioGroup options={options} />);
		expect(screen.getByText('Option A')).toBeTruthy();
		expect(screen.getByText('Option B')).toBeTruthy();
		expect(screen.getByText('Option C')).toBeTruthy();
	});

	it('renders legend when label provided', () => {
		render(<RadioGroup options={options} label="Choice" />);
		expect(screen.getByText('Choice')).toBeTruthy();
		const legend = document.querySelector('legend');
		expect(legend).toBeTruthy();
	});

	it('calls onChange with selected value', () => {
		const onChange = vi.fn();
		render(<RadioGroup options={options} onChange={onChange} />);
		const radios = document.querySelectorAll('input[type="radio"]');
		fireEvent.click(radios[1]);
		expect(onChange).toHaveBeenCalledWith('b');
	});

	it('reflects selected value', () => {
		render(<RadioGroup options={options} value="b" />);
		const radios = document.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
		expect(radios[0].checked).toBe(false);
		expect(radios[1].checked).toBe(true);
		expect(radios[2].checked).toBe(false);
	});

	it('applies disabled state', () => {
		render(<RadioGroup options={options} disabled />);
		const radios = document.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
		for (const radio of radios) {
			expect(radio.disabled).toBe(true);
		}
	});

	it('applies custom className', () => {
		const { container } = render(<RadioGroup options={options} className="mt-4" />);
		const fieldset = container.querySelector('fieldset');
		expect(fieldset?.className).toContain('mt-4');
	});

	it('renders error message', () => {
		render(<RadioGroup options={options} error="選択してください" />);
		expect(screen.getByRole('alert').textContent).toBe('選択してください');
	});

	it('applies aria-invalid on fieldset when error', () => {
		const { container } = render(<RadioGroup options={options} error="エラー" />);
		const fieldset = container.querySelector('fieldset')!;
		expect(fieldset.getAttribute('aria-invalid')).toBe('true');
	});

	it('does not show error when empty string', () => {
		render(<RadioGroup options={options} error="" />);
		expect(screen.queryByRole('alert')).toBeNull();
	});
});
