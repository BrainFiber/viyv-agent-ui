import type { CSSProperties } from 'react';

// ── Common Layout Props (used by Stack, Grid, Card, Box, Container) ──

export interface CommonLayoutProps {
	p?: number;
	px?: number;
	py?: number;
	bg?: string;
	rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
	shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
	border?: boolean;
}

const BG_MAP: Record<string, string> = {
	'surface': 'bg-surface',
	'surface-alt': 'bg-surface-alt',
	'muted': 'bg-muted',
	'primary-soft': 'bg-primary-soft',
	'danger-soft': 'bg-danger-soft',
	'success-soft': 'bg-success-soft',
	'warning-soft': 'bg-warning-soft',
	'transparent': 'bg-transparent',
};

const ROUNDED_MAP: Record<string, string> = {
	'none': 'rounded-none',
	'sm': 'rounded-sm',
	'md': 'rounded-md',
	'lg': 'rounded-lg',
	'xl': 'rounded-xl',
	'full': 'rounded-full',
};

const SHADOW_MAP: Record<string, string> = {
	'none': 'shadow-none',
	'sm': 'shadow-sm',
	'md': 'shadow-md',
	'lg': 'shadow-lg',
	'xl': 'shadow-xl',
};

export function buildCommonLayoutStyle(props: CommonLayoutProps): { className: string; style: CSSProperties } {
	const style: CSSProperties = {};
	const classes: string[] = [];

	// Spacing → inline style
	if (props.p != null) style.padding = `${props.p}px`;
	if (props.px != null) {
		style.paddingLeft = `${props.px}px`;
		style.paddingRight = `${props.px}px`;
	}
	if (props.py != null) {
		style.paddingTop = `${props.py}px`;
		style.paddingBottom = `${props.py}px`;
	}

	// Visual → literal class map
	if (props.bg && BG_MAP[props.bg]) classes.push(BG_MAP[props.bg]);
	if (props.rounded && ROUNDED_MAP[props.rounded]) classes.push(ROUNDED_MAP[props.rounded]);
	if (props.shadow && SHADOW_MAP[props.shadow]) classes.push(SHADOW_MAP[props.shadow]);
	if (props.border) classes.push('border', 'border-border');

	return { className: classes.join(' '), style };
}

// ── Box-Only Layout Props ──

export interface BoxLayoutProps {
	m?: number;
	mx?: number;
	my?: number;
	w?: string | number;
	h?: string | number;
	maxW?: string | number;
	minH?: string | number;
	display?: 'flex' | 'grid' | 'block' | 'inline-flex' | 'none';
	position?: 'relative' | 'absolute' | 'sticky' | 'fixed';
	top?: number | string;
	right?: number | string;
	bottom?: number | string;
	left?: number | string;
	zIndex?: number;
	overflow?: 'auto' | 'hidden' | 'scroll';
	flex?: '1' | 'auto' | 'none';
}

const SIZE_NAMES: Record<string, string> = {
	'full': '100%',
	'auto': 'auto',
	'fit': 'fit-content',
};

const SIZE_NAMES_W: Record<string, string> = {
	...SIZE_NAMES,
	'screen': '100vw',
};

const SIZE_NAMES_H: Record<string, string> = {
	...SIZE_NAMES,
	'screen': '100vh',
};

function resolveSizeValue(value: string | number, nameMap: Record<string, string>): string {
	if (typeof value === 'number') return `${value}px`;
	return nameMap[value] ?? value;
}

const DISPLAY_MAP: Record<string, string> = {
	'flex': 'flex',
	'grid': 'grid',
	'block': 'block',
	'inline-flex': 'inline-flex',
	'none': 'hidden',
};

const POSITION_MAP: Record<string, string> = {
	'relative': 'relative',
	'absolute': 'absolute',
	'sticky': 'sticky',
	'fixed': 'fixed',
};

const OVERFLOW_MAP: Record<string, string> = {
	'auto': 'overflow-auto',
	'hidden': 'overflow-hidden',
	'scroll': 'overflow-scroll',
};

const FLEX_MAP: Record<string, string> = {
	'1': 'flex-1',
	'auto': 'flex-auto',
	'none': 'flex-none',
};

export function buildBoxLayoutStyle(props: BoxLayoutProps): { className: string; style: CSSProperties } {
	const style: CSSProperties = {};
	const classes: string[] = [];

	// Margin → inline style
	if (props.m != null) style.margin = `${props.m}px`;
	if (props.mx != null) {
		style.marginLeft = `${props.mx}px`;
		style.marginRight = `${props.mx}px`;
	}
	if (props.my != null) {
		style.marginTop = `${props.my}px`;
		style.marginBottom = `${props.my}px`;
	}

	// Sizing → inline style
	if (props.w != null) style.width = resolveSizeValue(props.w, SIZE_NAMES_W);
	if (props.h != null) style.height = resolveSizeValue(props.h, SIZE_NAMES_H);
	if (props.maxW != null) style.maxWidth = resolveSizeValue(props.maxW, SIZE_NAMES_W);
	if (props.minH != null) style.minHeight = resolveSizeValue(props.minH, SIZE_NAMES_H);

	// Display → class
	if (props.display && DISPLAY_MAP[props.display]) classes.push(DISPLAY_MAP[props.display]);

	// Position → class + inset style
	if (props.position && POSITION_MAP[props.position]) classes.push(POSITION_MAP[props.position]);
	if (props.top != null) style.top = typeof props.top === 'number' ? `${props.top}px` : props.top;
	if (props.right != null) style.right = typeof props.right === 'number' ? `${props.right}px` : props.right;
	if (props.bottom != null) style.bottom = typeof props.bottom === 'number' ? `${props.bottom}px` : props.bottom;
	if (props.left != null) style.left = typeof props.left === 'number' ? `${props.left}px` : props.left;
	if (props.zIndex != null) style.zIndex = props.zIndex;

	// Overflow → class
	if (props.overflow && OVERFLOW_MAP[props.overflow]) classes.push(OVERFLOW_MAP[props.overflow]);

	// Flex item → class
	if (props.flex && FLEX_MAP[props.flex]) classes.push(FLEX_MAP[props.flex]);

	return { className: classes.join(' '), style };
}

// ── Sizing helpers (for Stack) ──

export interface SizingProps {
	w?: string | number;
	maxW?: string | number;
	minH?: string | number;
}

export function buildSizingStyle(props: SizingProps): CSSProperties {
	const style: CSSProperties = {};
	if (props.w != null) style.width = resolveSizeValue(props.w, SIZE_NAMES_W);
	if (props.maxW != null) style.maxWidth = resolveSizeValue(props.maxW, SIZE_NAMES_W);
	if (props.minH != null) style.minHeight = resolveSizeValue(props.minH, SIZE_NAMES_H);
	return style;
}
