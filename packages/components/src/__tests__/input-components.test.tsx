import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Combobox } from '../input/combobox.js';
import { Checkbox } from '../input/checkbox.js';
import { RadioGroup } from '../input/radio-group.js';
import { Rating } from '../input/rating.js';
import { Select } from '../input/select.js';
import { Slider } from '../input/slider.js';
import { Switch } from '../input/switch.js';
import { Input } from '../input/input.js';
import { Textarea } from '../input/textarea.js';

afterEach(cleanup);

describe('Input', () => {
	it('renders error message', () => {
		render(<Input error="必須です" />);
		expect(screen.getByRole('alert').textContent).toBe('必須です');
	});

	it('applies aria-invalid when error', () => {
		render(<Input error="必須です" />);
		const input = document.querySelector('input')!;
		expect(input.getAttribute('aria-invalid')).toBe('true');
	});

	it('does not show error when empty string', () => {
		render(<Input error="" />);
		expect(screen.queryByRole('alert')).toBeNull();
		const input = document.querySelector('input')!;
		expect(input.getAttribute('aria-invalid')).toBe('false');
	});

	it('links error via aria-describedby', () => {
		render(<Input error="bad" />);
		const input = document.querySelector('input')!;
		const describedBy = input.getAttribute('aria-describedby');
		expect(describedBy).toBeTruthy();
		expect(document.getElementById(describedBy!)?.textContent).toBe('bad');
	});

	it('renders with type="number"', () => {
		render(<Input type="number" />);
		const input = document.querySelector('input')!;
		expect(input.getAttribute('type')).toBe('number');
	});

	it('renders with type="date"', () => {
		render(<Input type="date" />);
		const input = document.querySelector('input')!;
		expect(input.getAttribute('type')).toBe('date');
	});

	it('defaults to type="text"', () => {
		render(<Input />);
		const input = document.querySelector('input')!;
		expect(input.getAttribute('type')).toBe('text');
	});

	it('type="number" onChange returns Number', () => {
		const onChange = vi.fn();
		render(<Input type="number" onChange={onChange} />);
		const input = document.querySelector('input')!;
		fireEvent.change(input, { target: { value: '42' } });
		expect(onChange).toHaveBeenCalledWith(42);
	});

	it('type="text" onChange returns string', () => {
		const onChange = vi.fn();
		render(<Input onChange={onChange} />);
		const input = document.querySelector('input')!;
		fireEvent.change(input, { target: { value: 'hello' } });
		expect(onChange).toHaveBeenCalledWith('hello');
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
		const trigger = screen.getByRole('combobox');
		expect(trigger.getAttribute('aria-invalid')).toBe('true');
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
		const checkbox = screen.getByRole('checkbox');
		fireEvent.click(checkbox);
		expect(onChange).toHaveBeenCalledWith(true);
	});

	it('reflects checked state', () => {
		render(<Checkbox checked />);
		const checkbox = screen.getByRole('checkbox');
		expect(checkbox.getAttribute('data-state')).toBe('checked');
	});

	it('applies disabled state', () => {
		render(<Checkbox disabled />);
		const checkbox = screen.getByRole('checkbox') as HTMLButtonElement;
		expect(checkbox.disabled).toBe(true);
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
		const checkbox = screen.getByRole('checkbox');
		expect(checkbox.getAttribute('aria-invalid')).toBe('true');
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

	it('renders label when provided', () => {
		render(<RadioGroup options={options} label="Choice" />);
		expect(screen.getByText('Choice')).toBeTruthy();
	});

	it('calls onChange with selected value', () => {
		const onChange = vi.fn();
		render(<RadioGroup options={options} onChange={onChange} />);
		const radios = screen.getAllByRole('radio');
		fireEvent.click(radios[1]);
		expect(onChange).toHaveBeenCalledWith('b');
	});

	it('reflects selected value', () => {
		render(<RadioGroup options={options} value="b" />);
		const radios = screen.getAllByRole('radio');
		expect(radios[0].getAttribute('data-state')).toBe('unchecked');
		expect(radios[1].getAttribute('data-state')).toBe('checked');
		expect(radios[2].getAttribute('data-state')).toBe('unchecked');
	});

	it('applies disabled state', () => {
		render(<RadioGroup options={options} disabled />);
		const radios = screen.getAllByRole('radio') as HTMLButtonElement[];
		for (const radio of radios) {
			expect(radio.disabled).toBe(true);
		}
	});

	it('applies custom className', () => {
		const { container } = render(<RadioGroup options={options} className="mt-4" />);
		const wrapper = container.firstElementChild;
		expect(wrapper?.className).toContain('mt-4');
	});

	it('renders error message', () => {
		render(<RadioGroup options={options} error="選択してください" />);
		expect(screen.getByRole('alert').textContent).toBe('選択してください');
	});

	it('applies aria-invalid on radiogroup root when error', () => {
		render(<RadioGroup options={options} error="エラー" />);
		const group = screen.getByRole('radiogroup');
		expect(group.getAttribute('aria-invalid')).toBe('true');
	});

	it('does not show error when empty string', () => {
		render(<RadioGroup options={options} error="" />);
		expect(screen.queryByRole('alert')).toBeNull();
	});
});

describe('Switch', () => {
	it('renders with role="switch"', () => {
		render(<Switch />);
		expect(screen.getByRole('switch')).toBeTruthy();
	});

	it('renders label', () => {
		render(<Switch label="通知" />);
		expect(screen.getByText('通知')).toBeTruthy();
	});

	it('reflects checked state via aria-checked', () => {
		render(<Switch checked={true} />);
		expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('true');
	});

	it('calls onChange on click', () => {
		const onChange = vi.fn();
		render(<Switch checked={false} onChange={onChange} />);
		fireEvent.click(screen.getByRole('switch'));
		expect(onChange).toHaveBeenCalledWith(true);
	});

	it('disables the button', () => {
		render(<Switch disabled />);
		expect((screen.getByRole('switch') as HTMLButtonElement).disabled).toBe(true);
	});

	it('renders error message', () => {
		render(<Switch error="エラー" />);
		expect(screen.getByRole('alert').textContent).toBe('エラー');
	});
});

describe('Slider', () => {
	it('renders slider', () => {
		render(<Slider />);
		expect(screen.getByRole('slider')).toBeTruthy();
	});

	it('sets min/max/step', () => {
		render(<Slider min={10} max={50} step={5} />);
		const slider = screen.getByRole('slider');
		expect(slider.getAttribute('aria-valuemin')).toBe('10');
		expect(slider.getAttribute('aria-valuemax')).toBe('50');
	});

	it('renders label', () => {
		render(<Slider label="音量" />);
		expect(screen.getByText('音量')).toBeTruthy();
	});

	it('shows value when showValue is true', () => {
		render(<Slider value={42} showValue />);
		expect(screen.getByText('42')).toBeTruthy();
	});

	it('reflects current value', () => {
		render(<Slider value={75} />);
		const slider = screen.getByRole('slider');
		expect(slider.getAttribute('aria-valuenow')).toBe('75');
	});
});

describe('Combobox', () => {
	const options = [
		{ value: 'tokyo', label: 'Tokyo' },
		{ value: 'osaka', label: 'Osaka' },
		{ value: 'kyoto', label: 'Kyoto' },
	];

	it('renders with role="combobox"', () => {
		render(<Combobox options={options} />);
		expect(screen.getByRole('combobox')).toBeTruthy();
	});

	it('renders label', () => {
		render(<Combobox options={options} label="City" />);
		expect(screen.getByText('City')).toBeTruthy();
	});

	it('displays placeholder text', () => {
		render(<Combobox options={options} placeholder="Choose city" />);
		expect(screen.getByText('Choose city')).toBeTruthy();
	});

	it('displays selected value label', () => {
		render(<Combobox options={options} value="osaka" />);
		expect(screen.getByText('Osaka')).toBeTruthy();
	});

	it('renders error message', () => {
		render(<Combobox options={options} error="必須です" />);
		expect(screen.getByRole('alert').textContent).toBe('必須です');
	});

	it('applies aria-invalid when error', () => {
		render(<Combobox options={options} error="エラー" />);
		const trigger = screen.getByRole('combobox');
		expect(trigger.getAttribute('aria-invalid')).toBe('true');
	});
});

describe('Rating', () => {
	it('renders stars with role="radiogroup"', () => {
		render(<Rating />);
		expect(screen.getByRole('radiogroup')).toBeTruthy();
	});

	it('renders max stars', () => {
		render(<Rating max={3} />);
		expect(screen.getAllByRole('radio').length).toBe(3);
	});

	it('has aria-label on radiogroup', () => {
		render(<Rating label="Satisfaction" />);
		expect(screen.getByRole('radiogroup').getAttribute('aria-label')).toBe('Satisfaction');
	});

	it('marks correct star as checked', () => {
		render(<Rating value={3} max={5} />);
		const stars = screen.getAllByRole('radio');
		expect(stars[2].getAttribute('aria-checked')).toBe('true');
		expect(stars[0].getAttribute('aria-checked')).toBe('false');
	});

	it('calls onChange on star click', () => {
		const onChange = vi.fn();
		render(<Rating onChange={onChange} />);
		fireEvent.click(screen.getByLabelText('4 stars'));
		expect(onChange).toHaveBeenCalledWith(4);
	});

	it('disables all stars', () => {
		render(<Rating disabled />);
		for (const star of screen.getAllByRole('radio')) {
			expect((star as HTMLButtonElement).disabled).toBe(true);
		}
	});
});
