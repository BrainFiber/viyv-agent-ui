/** Interactive map with markers (OpenStreetMap / Leaflet). View layer only. */

import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';
import { normalizeMarkers, type NormalizeOptions } from './map-utils.js';
import { useLeaflet } from './use-leaflet.js';

export interface MapProps extends NormalizeOptions {
	center: [number, number];
	zoom?: number;
	markers?: unknown;
	height?: number;
	className?: string;
}

function MapPlaceholder({ height, className, children }: { height: number; className?: string; children: string }) {
	return (
		<div
			className={cn(
				'flex items-center justify-center rounded-lg border bg-gray-50 text-sm text-gray-400',
				className,
			)}
			style={{ height }}
		>
			{children}
		</div>
	);
}

export function Map({
	center,
	zoom = 13,
	markers,
	latKey,
	lngKey,
	labelKey,
	popupKey,
	height = 400,
	className,
}: MapProps) {
	const { modules, error } = useLeaflet();
	const normalizedMarkers = normalizeMarkers(markers, { latKey, lngKey, labelKey, popupKey });

	if (error) {
		return <MapPlaceholder height={height} className={className}>Map unavailable (leaflet not installed)</MapPlaceholder>;
	}

	if (!modules) {
		return <MapPlaceholder height={height} className={className}>Loading map…</MapPlaceholder>;
	}

	const { RL } = modules;

	return (
		<div className={cn('overflow-hidden rounded-lg', className)} style={{ height }}>
			<RL.MapContainer
				center={center}
				zoom={zoom}
				style={{ width: '100%', height: '100%' }}
				scrollWheelZoom
			>
				<RL.TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{normalizedMarkers.map((m, i) => (
					<RL.Marker key={`${m.lat}-${m.lng}-${i}`} position={[m.lat, m.lng]} alt={m.label ?? `Marker ${i + 1}`}>
						{(m.label || m.popup) && (
							<RL.Popup>
								{m.label && <strong>{m.label}</strong>}
								{m.label && m.popup && <br />}
								{m.popup && <span>{m.popup}</span>}
							</RL.Popup>
						)}
					</RL.Marker>
				))}
			</RL.MapContainer>
		</div>
	);
}

export const mapMeta: ComponentMeta = {
	type: 'Map',
	label: 'Map',
	description: 'Interactive map with markers (OpenStreetMap / Leaflet)',
	category: 'display',
	propsSchema: z.object({
		center: z.tuple([z.number(), z.number()]),
		zoom: z.number().int().min(1).max(20).default(13),
		markers: z.unknown(),
		latKey: z.string().optional(),
		lngKey: z.string().optional(),
		labelKey: z.string().optional(),
		popupKey: z.string().optional(),
		height: z.number().default(400),
	}),
	acceptsChildren: false,
};
