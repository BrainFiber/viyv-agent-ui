import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';

export interface ItemContextValue {
	item: unknown;
	index: number;
}

const ItemContext = createContext<ItemContextValue | null>(null);

export function ItemProvider({
	item,
	index,
	children,
}: ItemContextValue & { children: ReactNode }) {
	const value = useMemo(() => ({ item, index }), [item, index]);
	return (
		<ItemContext.Provider value={value}>
			{children}
		</ItemContext.Provider>
	);
}

export function useItemContext(): ItemContextValue | null {
	return useContext(ItemContext);
}
