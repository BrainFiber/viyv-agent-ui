import { ElementRenderer } from '../element-renderer.js';
import { ItemProvider } from '../providers/item-provider.js';
import type { TypeHandlerProps } from './index.js';

export function TimelineRenderer({ element, resolvedProps }: TypeHandlerProps) {
	const data = resolvedProps.data;
	const keyField = resolvedProps.keyField as string | undefined;
	const labelKey = resolvedProps.labelKey as string | undefined;
	const timestampKey = resolvedProps.timestampKey as string | undefined;
	const emptyMessage = resolvedProps.emptyMessage as string | undefined;

	const items = Array.isArray(data) ? (data as Record<string, unknown>[]) : [];

	if (items.length === 0) {
		return (
			<div role="list" aria-label="Timeline">
				<p className="py-8 text-center text-sm text-gray-500">
					{emptyMessage ?? 'データがありません'}
				</p>
			</div>
		);
	}

	return (
		<div role="list" aria-label="Timeline" style={{ borderLeft: '2px solid #e5e7eb', marginLeft: '8px', paddingLeft: '0' }}>
			{items.map((item, idx) => {
				const key = keyField ? String(item[keyField]) : String(idx);
				const label = getItemLabel(item, labelKey, keyField, idx);
				const timestamp = timestampKey ? String(item[timestampKey] ?? '') : undefined;

				return (
					<div key={key} role="listitem" aria-label={label} className="relative pb-5" style={{ paddingLeft: '24px' }}>
						{/* Dot on the line */}
						<div
							style={{
								position: 'absolute',
								left: '-7px',
								top: '16px',
								width: '12px',
								height: '12px',
								borderRadius: '50%',
								backgroundColor: '#3b82f6',
								border: '3px solid #dbeafe',
							}}
						/>

						{/* Event card */}
						<div className="rounded-lg border border-gray-100 bg-gray-50/50 p-3 shadow-sm">
							{timestamp && (
								<p className="text-xs text-gray-400 mb-2 font-mono">{timestamp}</p>
							)}
							<ItemProvider item={item} index={idx}>
								{element.children?.map((childId) => (
									<ElementRenderer key={childId} elementId={childId} />
								))}
							</ItemProvider>
						</div>
					</div>
				);
			})}
		</div>
	);
}

function getItemLabel(
	item: unknown,
	labelKey: string | undefined,
	keyField: string | undefined,
	index: number,
): string {
	if (item && typeof item === 'object') {
		const rec = item as Record<string, unknown>;
		if (labelKey && rec[labelKey] != null) return String(rec[labelKey]);
		if (keyField && rec[keyField] != null) return String(rec[keyField]);
	}
	return `Event ${index + 1}`;
}
