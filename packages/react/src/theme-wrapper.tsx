import { useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Theme } from '@viyv/agent-ui-schema';
import { buildThemeStyle } from './build-theme-style.js';
import { useFontLoader } from './use-font-loader.js';

export interface ThemeWrapperProps {
	theme?: Theme;
	children: ReactNode;
}

export function ThemeWrapper({ theme, children }: ThemeWrapperProps) {
	const accentColor = theme?.accentColor;
	const fontPrimary = theme?.fontFamily?.primary;
	const fontAccent = theme?.fontFamily?.accent;
	const borderRadius = theme?.borderRadius;

	const style = useMemo(
		() => buildThemeStyle(theme),
		[accentColor, fontPrimary, fontAccent, borderRadius],
	);
	useFontLoader(theme?.fontFamily);

	return style ? <div style={style}>{children}</div> : <>{children}</>;
}
