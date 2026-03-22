import type { ReactNode } from 'react';
import type { Theme } from '@viyv/agent-ui-schema';

export interface ThemeWrapperProps {
	theme?: Theme;
	children: ReactNode;
}

export function ThemeWrapper({ theme, children }: ThemeWrapperProps) {
	const style = theme?.accentColor
		? ({ '--color-primary': theme.accentColor } as React.CSSProperties)
		: undefined;

	return style ? <div style={style}>{children}</div> : <>{children}</>;
}
