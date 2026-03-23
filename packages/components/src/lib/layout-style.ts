import { z } from 'zod';
import type { CSSProperties } from 'react';

// ── Common Layout Props (used by Stack, Grid, Card, Box, Container, Section) ──

export interface CommonLayoutProps {
	p?: number;
	px?: number;
	py?: number;
	bg?: string;
	rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
	shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
	border?: boolean;
	hoverEffect?: 'lift' | 'glow' | 'scale' | 'none';
}

// ── Background Gradient / Image Props ──

export interface BgGradientProps {
	bgGradient?: {
		from: string;
		to: string;
		via?: string;
		direction?: 'to-t' | 'to-tr' | 'to-r' | 'to-br' | 'to-b' | 'to-bl' | 'to-l' | 'to-tl';
	};
}

export interface BgImageProps {
	bgImage?: string;
}

const GRADIENT_DIRECTION_MAP: Record<string, string> = {
	'to-t': 'to top',
	'to-tr': 'to top right',
	'to-r': 'to right',
	'to-br': 'to bottom right',
	'to-b': 'to bottom',
	'to-bl': 'to bottom left',
	'to-l': 'to left',
	'to-tl': 'to top left',
};

export function buildBgStyle(props: BgGradientProps & BgImageProps): { style: CSSProperties } {
	const style: CSSProperties = {};
	if (props.bgGradient) {
		const { from, to, via, direction = 'to-r' } = props.bgGradient;
		const dir = GRADIENT_DIRECTION_MAP[direction] ?? 'to right';
		const stops = via ? `${from}, ${via}, ${to}` : `${from}, ${to}`;
		style.background = `linear-gradient(${dir}, ${stops})`;
	}
	if (props.bgImage) {
		style.backgroundImage = `url(${props.bgImage})`;
		style.backgroundSize = 'cover';
		style.backgroundPosition = 'center';
	}
	return { style };
}

// ── Shared Max Width Map (used by Container, Section) ──

export const MAX_WIDTH_MAP: Record<string, string> = {
	sm: '640px',
	md: '768px',
	lg: '1024px',
	xl: '1280px',
	'2xl': '1536px',
	full: '100%',
};

// ── Shared Zod Schemas (for DRY component Meta definitions) ──

export const bgGradientPropsSchema = z.object({
	bgGradient: z.object({
		from: z.string(),
		to: z.string(),
		via: z.string().optional(),
		direction: z.enum(['to-t', 'to-tr', 'to-r', 'to-br', 'to-b', 'to-bl', 'to-l', 'to-tl']).optional(),
	}).optional(),
});

export const bgImagePropsSchema = z.object({
	bgImage: z.string().optional(),
});

export const hoverEffectPropsSchema = z.object({
	hoverEffect: z.enum(['lift', 'glow', 'scale', 'none']).optional(),
});

const BG_MAP: Record<string, string> = {
	'surface': 'bg-surface',
	'surface-alt': 'bg-surface-alt',
	'muted': 'bg-muted',
	'primary-soft': 'bg-primary-soft',
	'danger-soft': 'bg-danger-soft',
	'success-soft': 'bg-success-soft',
	'warning-soft': 'bg-warning-soft',
	'transparent': 'bg-transparent',
	'accent': 'bg-accent',
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

const HOVER_EFFECT_MAP: Record<string, string> = {
	lift: 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer',
	glow: 'transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/20 cursor-pointer',
	scale: 'transition-transform duration-200 hover:scale-105 cursor-pointer',
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
	if (props.bg) {
		if (BG_MAP[props.bg]) {
			classes.push(BG_MAP[props.bg]);
		} else {
			// Fallback: treat as arbitrary CSS color value
			style.backgroundColor = props.bg;
		}
	}
	if (props.rounded && ROUNDED_MAP[props.rounded]) classes.push(ROUNDED_MAP[props.rounded]);
	if (props.shadow && SHADOW_MAP[props.shadow]) classes.push(SHADOW_MAP[props.shadow]);
	if (props.border) classes.push('border', 'border-border');

	// Hover effect → Tailwind classes
	if (props.hoverEffect && props.hoverEffect !== 'none' && HOVER_EFFECT_MAP[props.hoverEffect]) {
		classes.push(HOVER_EFFECT_MAP[props.hoverEffect]);
	}

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
