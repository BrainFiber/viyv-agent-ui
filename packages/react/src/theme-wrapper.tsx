import { useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Theme } from '@viyv/agent-ui-schema';
import { derivePrimaryPalette } from './color-utils.js';

export interface ThemeWrapperProps {
	theme?: Theme;
	children: ReactNode;
}

export function ThemeWrapper({ theme, children }: ThemeWrapperProps) {
	const style = useMemo(() => {
		if (!theme?.accentColor) return undefined;
		return derivePrimaryPalette(theme.accentColor) as React.CSSProperties;
	}, [theme?.accentColor]);

	return style ? <div style={style}>{children}</div> : <>{children}</>;
}
