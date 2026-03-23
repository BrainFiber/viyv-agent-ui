import type { CSSProperties } from 'react';
import type { Theme } from '@viyv/agent-ui-schema';
import { derivePrimaryPalette } from './color-utils.js';

const RADIUS_SCALES: Record<string, Record<string, string>> = {
	none: { '--radius-sm': '0', '--radius-md': '0', '--radius-lg': '0', '--radius-xl': '0' },
	sm: { '--radius-sm': '0.125rem', '--radius-md': '0.25rem', '--radius-lg': '0.375rem', '--radius-xl': '0.5rem' },
	// md = default values from theme.css, no overrides needed
	lg: { '--radius-sm': '0.375rem', '--radius-md': '0.625rem', '--radius-lg': '0.875rem', '--radius-xl': '1.25rem' },
	xl: { '--radius-sm': '0.5rem', '--radius-md': '0.875rem', '--radius-lg': '1.25rem', '--radius-xl': '1.75rem' },
};

/**
 * Pure function to generate CSS properties from a Theme object.
 * Generates accent color palette, font family, and border radius overrides.
 *
 * CSS custom properties (--color-*, --radius-*) are set via React's style prop,
 * which accepts them under `CSSProperties` with string index signature.
 */
export function buildThemeStyle(theme?: Theme): CSSProperties | undefined {
	if (!theme) return undefined;

	const style: CSSProperties & Record<string, string> = {};
	let hasStyles = false;

	// Accent color → full primary palette (CSS custom properties)
	if (theme.accentColor) {
		Object.assign(style, derivePrimaryPalette(theme.accentColor));
		hasStyles = true;
	}

	// Font family
	if (theme.fontFamily?.primary) {
		style.fontFamily = `"${theme.fontFamily.primary}", var(--font-sans)`;
		hasStyles = true;
	}

	// Border radius scale override (CSS custom properties)
	if (theme.borderRadius && RADIUS_SCALES[theme.borderRadius]) {
		Object.assign(style, RADIUS_SCALES[theme.borderRadius]);
		hasStyles = true;
	}

	return hasStyles ? style : undefined;
}
