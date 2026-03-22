/**
 * Color utility functions for deriving theme palettes from a single accent color.
 */

/** Parse #rrggbb or #rgb into { r, g, b } (0-255). */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
	const h = hex.replace(/^#/, '');
	if (h.length === 3) {
		return {
			r: parseInt(h[0] + h[0], 16),
			g: parseInt(h[1] + h[1], 16),
			b: parseInt(h[2] + h[2], 16),
		};
	}
	return {
		r: parseInt(h.slice(0, 2), 16),
		g: parseInt(h.slice(2, 4), 16),
		b: parseInt(h.slice(4, 6), 16),
	};
}

/** Convert RGB (0-255) to HSL (h: 0-360, s: 0-1, l: 0-1). */
export function rgbToHsl(
	r: number,
	g: number,
	b: number,
): { h: number; s: number; l: number } {
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;
	const max = Math.max(rn, gn, bn);
	const min = Math.min(rn, gn, bn);
	const l = (max + min) / 2;

	if (max === min) {
		return { h: 0, s: 0, l };
	}

	const d = max - min;
	const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

	let h: number;
	if (max === rn) {
		h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
	} else if (max === gn) {
		h = ((bn - rn) / d + 2) / 6;
	} else {
		h = ((rn - gn) / d + 4) / 6;
	}

	return { h: h * 360, s, l };
}

/** Convert HSL (h: 0-360, s: 0-1, l: 0-1) back to #rrggbb. */
export function hslToHex(h: number, s: number, l: number): string {
	const hue2rgb = (p: number, q: number, t: number): number => {
		let tt = t;
		if (tt < 0) tt += 1;
		if (tt > 1) tt -= 1;
		if (tt < 1 / 6) return p + (q - p) * 6 * tt;
		if (tt < 1 / 2) return q;
		if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
		return p;
	};

	let r: number;
	let g: number;
	let b: number;

	if (s === 0) {
		r = g = b = l;
	} else {
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		const hn = h / 360;
		r = hue2rgb(p, q, hn + 1 / 3);
		g = hue2rgb(p, q, hn);
		b = hue2rgb(p, q, hn - 1 / 3);
	}

	const toHex = (v: number): string => {
		const hex = Math.round(v * 255)
			.toString(16)
			.padStart(2, '0');
		return hex;
	};

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Derive a full primary palette from a single hex color.
 *
 * Returns a record of CSS custom property name → value:
 *   --color-primary, --color-primary-hover, --color-primary-fg,
 *   --color-primary-soft, --color-primary-soft-fg, --color-primary-soft-border,
 *   --color-ring
 */
export function derivePrimaryPalette(hex: string): Record<string, string> {
	const { r, g, b } = hexToRgb(hex);
	const { h, s, l } = rgbToHsl(r, g, b);

	// WCAG relative luminance (simplified)
	const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
	const fg = luminance < 0.5 ? '#ffffff' : '#000000';

	return {
		'--color-primary': hex,
		'--color-primary-hover': hslToHex(h, s, Math.max(l - 0.1, 0.05)),
		'--color-primary-fg': fg,
		'--color-primary-soft': hslToHex(h, Math.min(s, 0.3), 0.95),
		'--color-primary-soft-fg': hslToHex(h, s, Math.max(l - 0.4, 0.15)),
		'--color-primary-soft-border': hslToHex(h, Math.min(s, 0.5), 0.8),
		'--color-ring': hex,
	};
}
