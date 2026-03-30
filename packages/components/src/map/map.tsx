/** Interactive map with markers and overlay layers (OpenStreetMap / Leaflet). View layer only. */

import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';
import { normalizeMarkers, normalizeOverlays, type NormalizeOptions, type MapOverlay } from './map-utils.js';
import { useLeaflet, type LeafletModules } from './use-leaflet.js';

export interface MapProps extends NormalizeOptions {
	center: [number, number];
	zoom?: number;
	markers?: unknown;
	overlays?: unknown;
	height?: number;
	className?: string;
}

function MapPlaceholder({ height, className, children }: { height: number; className?: string; children: string }) {
	return (
		<div
			className={cn(
				'flex items-center justify-center rounded-lg border bg-surface-alt text-sm text-fg-subtle',
				className,
			)}
			style={{ height }}
		>
			{children}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Overlay rendering helpers
// ---------------------------------------------------------------------------

function toPathOptions(overlay: MapOverlay): Record<string, unknown> {
	const opts: Record<string, unknown> = {};
	if (overlay.color != null) opts.color = overlay.color;
	if (overlay.fillColor != null) opts.fillColor = overlay.fillColor;
	if (overlay.fillOpacity != null) opts.fillOpacity = overlay.fillOpacity;
	if (overlay.opacity != null) opts.opacity = overlay.opacity;
	if (overlay.weight != null) opts.weight = overlay.weight;
	if (overlay.dashArray != null) opts.dashArray = overlay.dashArray;
	return opts;
}

function OverlayChildren({ overlay, RL }: { overlay: MapOverlay; RL: LeafletModules['RL'] }) {
	return (
		<>
			{overlay.label && <RL.Tooltip permanent>{overlay.label}</RL.Tooltip>}
			{overlay.popup && <RL.Popup><span>{overlay.popup}</span></RL.Popup>}
		</>
	);
}

function OverlayRenderer({ overlay, RL }: { overlay: MapOverlay; RL: LeafletModules['RL'] }) {
	const pathOptions = toPathOptions(overlay);

	switch (overlay.type) {
		case 'circle':
			return (
				<RL.Circle center={overlay.center} radius={overlay.radius} pathOptions={pathOptions}>
					<OverlayChildren overlay={overlay} RL={RL} />
				</RL.Circle>
			);
		case 'polyline':
			return (
				<RL.Polyline positions={overlay.positions} pathOptions={pathOptions}>
					<OverlayChildren overlay={overlay} RL={RL} />
				</RL.Polyline>
			);
		case 'polygon':
			return (
				<RL.Polygon positions={overlay.positions} pathOptions={pathOptions}>
					<OverlayChildren overlay={overlay} RL={RL} />
				</RL.Polygon>
			);
		case 'rectangle':
			return (
				<RL.Rectangle bounds={overlay.bounds} pathOptions={pathOptions}>
					<OverlayChildren overlay={overlay} RL={RL} />
				</RL.Rectangle>
			);
	}
}

// ---------------------------------------------------------------------------
// Map component
// ---------------------------------------------------------------------------

export function Map({
	center,
	zoom = 13,
	markers,
	overlays,
	latKey,
	lngKey,
	labelKey,
	popupKey,
	height = 400,
	className,
}: MapProps) {
	const { modules, error } = useLeaflet();
	const normalizedMarkers = normalizeMarkers(markers, { latKey, lngKey, labelKey, popupKey });
	const normalizedOverlays = normalizeOverlays(overlays);

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
				{/* Overlays render first so markers appear on top */}
				{normalizedOverlays.map((overlay, i) => (
					<OverlayRenderer key={`overlay-${overlay.type}-${i}`} overlay={overlay} RL={RL} />
				))}
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

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const latLng = z.tuple([z.number(), z.number()]);

const overlayCommon = {
	color: z.string().optional(),
	fillColor: z.string().optional(),
	fillOpacity: z.number().min(0).max(1).optional(),
	opacity: z.number().min(0).max(1).optional(),
	weight: z.number().optional(),
	dashArray: z.string().optional(),
	label: z.string().optional(),
	popup: z.string().optional(),
};

export const mapMeta: ComponentMeta = {
	type: 'Map',
	label: 'Map',
	description: 'Interactive map with markers and overlay layers (circles, polylines, polygons, rectangles) using OpenStreetMap / Leaflet',
	category: 'map',
	propsSchema: z.object({
		center: z.tuple([z.number(), z.number()]),
		zoom: z.number().int().min(1).max(20).default(13),
		markers: z.unknown(),
		overlays: z.array(z.discriminatedUnion('type', [
			z.object({ type: z.literal('circle'), center: latLng, radius: z.number().positive(), ...overlayCommon }),
			z.object({ type: z.literal('polyline'), positions: z.array(latLng).min(2), ...overlayCommon }),
			z.object({ type: z.literal('polygon'), positions: z.array(latLng).min(3), ...overlayCommon }),
			z.object({ type: z.literal('rectangle'), bounds: z.tuple([latLng, latLng]), ...overlayCommon }),
		])).optional(),
		latKey: z.string().optional(),
		lngKey: z.string().optional(),
		labelKey: z.string().optional(),
		popupKey: z.string().optional(),
		height: z.number().default(400),
	}),
	acceptsChildren: false,
};
