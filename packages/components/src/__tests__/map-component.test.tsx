import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

// Mock useLeaflet to control loading/error state
const mockUseLeaflet = vi.fn();
vi.mock('../map/use-leaflet.js', () => ({
	useLeaflet: () => mockUseLeaflet(),
}));

const loadingResult = { modules: null, error: false };
const errorResult = { modules: null, error: true };

// Minimal react-leaflet mocks
const MockMapContainer = ({ children, ...props }: any) => (
	<div data-testid="map-container" data-center={JSON.stringify(props.center)} data-zoom={props.zoom}>
		{children}
	</div>
);
const MockTileLayer = () => <div data-testid="tile-layer" />;
const MockMarker = ({ children, position, alt }: any) => (
	<div data-testid="marker" data-position={JSON.stringify(position)} aria-label={alt}>
		{children}
	</div>
);
const MockPopup = ({ children }: any) => <div data-testid="popup">{children}</div>;
const MockCircle = ({ children, center, radius, pathOptions }: any) => (
	<div data-testid="circle" data-center={JSON.stringify(center)} data-radius={radius} data-path={JSON.stringify(pathOptions)}>
		{children}
	</div>
);
const MockPolyline = ({ children, positions, pathOptions }: any) => (
	<div data-testid="polyline" data-positions={JSON.stringify(positions)} data-path={JSON.stringify(pathOptions)}>
		{children}
	</div>
);
const MockPolygon = ({ children, positions, pathOptions }: any) => (
	<div data-testid="polygon" data-positions={JSON.stringify(positions)} data-path={JSON.stringify(pathOptions)}>
		{children}
	</div>
);
const MockRectangle = ({ children, bounds, pathOptions }: any) => (
	<div data-testid="rectangle" data-bounds={JSON.stringify(bounds)} data-path={JSON.stringify(pathOptions)}>
		{children}
	</div>
);
const MockTooltip = ({ children }: any) => <div data-testid="tooltip">{children}</div>;

const loadedResult = {
	modules: {
		L: {} as any,
		RL: {
			MapContainer: MockMapContainer,
			TileLayer: MockTileLayer,
			Marker: MockMarker,
			Popup: MockPopup,
			Circle: MockCircle,
			Polyline: MockPolyline,
			Polygon: MockPolygon,
			Rectangle: MockRectangle,
			Tooltip: MockTooltip,
		} as any,
	},
	error: false,
};

import { Map } from '../map/map.js';

afterEach(() => {
	cleanup();
	mockUseLeaflet.mockReset();
});

describe('Map', () => {
	it('shows loading placeholder when modules are not yet loaded', () => {
		mockUseLeaflet.mockReturnValue(loadingResult);
		render(<Map center={[35.68, 139.76]} />);
		expect(screen.getByText('Loading map…')).toBeTruthy();
	});

	it('renders map container when modules are loaded', () => {
		mockUseLeaflet.mockReturnValue(loadedResult);
		render(<Map center={[35.68, 139.76]} />);
		expect(screen.getByTestId('map-container')).toBeTruthy();
		expect(screen.getByTestId('tile-layer')).toBeTruthy();
	});

	it('renders markers', () => {
		mockUseLeaflet.mockReturnValue(loadedResult);
		const markers = [
			{ lat: 35.68, lng: 139.76, label: 'Tokyo' },
			{ lat: 34.69, lng: 135.5, label: 'Osaka', popup: 'Second city' },
		];
		render(<Map center={[35.68, 139.76]} markers={markers} />);
		const markerEls = screen.getAllByTestId('marker');
		expect(markerEls).toHaveLength(2);
	});

	it('renders popup with label and popup text', () => {
		mockUseLeaflet.mockReturnValue(loadedResult);
		const markers = [{ lat: 35.68, lng: 139.76, label: 'Tokyo', popup: 'Capital of Japan' }];
		render(<Map center={[35.68, 139.76]} markers={markers} />);
		expect(screen.getByText('Tokyo')).toBeTruthy();
		expect(screen.getByText('Capital of Japan')).toBeTruthy();
	});

	it('applies custom height', () => {
		mockUseLeaflet.mockReturnValue(loadingResult);
		const { container } = render(<Map center={[35.68, 139.76]} height={600} />);
		const div = container.firstElementChild as HTMLElement;
		expect(div.style.height).toBe('600px');
	});

	it('applies className', () => {
		mockUseLeaflet.mockReturnValue(loadingResult);
		const { container } = render(<Map center={[35.68, 139.76]} className="custom-map" />);
		expect(container.firstElementChild?.classList.contains('custom-map')).toBe(true);
	});

	it('applies default zoom of 13', () => {
		mockUseLeaflet.mockReturnValue(loadedResult);
		render(<Map center={[35.68, 139.76]} />);
		const container = screen.getByTestId('map-container');
		expect(container.getAttribute('data-zoom')).toBe('13');
	});

	it('uses custom zoom', () => {
		mockUseLeaflet.mockReturnValue(loadedResult);
		render(<Map center={[35.68, 139.76]} zoom={16} />);
		const container = screen.getByTestId('map-container');
		expect(container.getAttribute('data-zoom')).toBe('16');
	});

	it('shows error state when leaflet is not installed', () => {
		mockUseLeaflet.mockReturnValue(errorResult);
		render(<Map center={[35.68, 139.76]} />);
		expect(screen.getByText('Map unavailable (leaflet not installed)')).toBeTruthy();
	});

	it('renders map with no markers when markers is undefined', () => {
		mockUseLeaflet.mockReturnValue(loadedResult);
		render(<Map center={[35.68, 139.76]} />);
		expect(screen.getByTestId('map-container')).toBeTruthy();
		expect(screen.queryByTestId('marker')).toBeNull();
	});

	it('renders map with no markers when markers is empty array', () => {
		mockUseLeaflet.mockReturnValue(loadedResult);
		render(<Map center={[35.68, 139.76]} markers={[]} />);
		expect(screen.getByTestId('map-container')).toBeTruthy();
		expect(screen.queryByTestId('marker')).toBeNull();
	});

	it('does not render marker popup when neither label nor popup provided', () => {
		mockUseLeaflet.mockReturnValue(loadedResult);
		const markers = [{ lat: 35.68, lng: 139.76 }];
		render(<Map center={[35.68, 139.76]} markers={markers} />);
		expect(screen.queryByTestId('popup')).toBeNull();
	});

	it('passes alt attribute with label to Marker', () => {
		mockUseLeaflet.mockReturnValue(loadedResult);
		const markers = [{ lat: 35.68, lng: 139.76, label: 'Tokyo Station' }];
		render(<Map center={[35.68, 139.76]} markers={markers} />);
		expect(screen.getByLabelText('Tokyo Station')).toBeTruthy();
	});

	it('falls back to "Marker N" when label is not provided', () => {
		mockUseLeaflet.mockReturnValue(loadedResult);
		const markers = [
			{ lat: 35.68, lng: 139.76 },
			{ lat: 34.69, lng: 135.5 },
		];
		render(<Map center={[35.68, 139.76]} markers={markers} />);
		expect(screen.getByLabelText('Marker 1')).toBeTruthy();
		expect(screen.getByLabelText('Marker 2')).toBeTruthy();
	});

	// -- overlay tests ---------------------------------------------------------

	it('renders circle overlays', () => {
		mockUseLeaflet.mockReturnValue(loadedResult);
		const overlays = [{ type: 'circle', center: [28.83, 50.89], radius: 10000, color: 'red' }];
		render(<Map center={[28.83, 50.89]} overlays={overlays} />);
		const circle = screen.getByTestId('circle');
		expect(circle).toBeTruthy();
		expect(circle.getAttribute('data-center')).toBe(JSON.stringify([28.83, 50.89]));
		expect(circle.getAttribute('data-radius')).toBe('10000');
	});

	it('renders polyline overlays', () => {
		mockUseLeaflet.mockReturnValue(loadedResult);
		const overlays = [{ type: 'polyline', positions: [[0, 0], [1, 1]], color: 'blue' }];
		render(<Map center={[0, 0]} overlays={overlays} />);
		expect(screen.getByTestId('polyline')).toBeTruthy();
	});

	it('renders polygon overlays', () => {
		mockUseLeaflet.mockReturnValue(loadedResult);
		const overlays = [{ type: 'polygon', positions: [[0, 0], [1, 0], [1, 1]], color: 'green' }];
		render(<Map center={[0, 0]} overlays={overlays} />);
		expect(screen.getByTestId('polygon')).toBeTruthy();
	});

	it('renders rectangle overlays', () => {
		mockUseLeaflet.mockReturnValue(loadedResult);
		const overlays = [{ type: 'rectangle', bounds: [[0, 0], [1, 1]], color: 'orange' }];
		render(<Map center={[0, 0]} overlays={overlays} />);
		expect(screen.getByTestId('rectangle')).toBeTruthy();
	});

	it('renders tooltip for overlay with label', () => {
		mockUseLeaflet.mockReturnValue(loadedResult);
		const overlays = [{ type: 'circle', center: [0, 0], radius: 1000, label: 'Zone A' }];
		render(<Map center={[0, 0]} overlays={overlays} />);
		expect(screen.getByTestId('tooltip')).toBeTruthy();
		expect(screen.getByText('Zone A')).toBeTruthy();
	});

	it('renders popup for overlay with popup text', () => {
		mockUseLeaflet.mockReturnValue(loadedResult);
		const overlays = [{ type: 'circle', center: [0, 0], radius: 1000, popup: 'Details here' }];
		render(<Map center={[0, 0]} overlays={overlays} />);
		expect(screen.getByText('Details here')).toBeTruthy();
	});

	it('does not render tooltip/popup when overlay has neither label nor popup', () => {
		mockUseLeaflet.mockReturnValue(loadedResult);
		const overlays = [{ type: 'circle', center: [0, 0], radius: 1000 }];
		render(<Map center={[0, 0]} overlays={overlays} />);
		expect(screen.queryByTestId('tooltip')).toBeNull();
		// popup testid exists from marker mock but circle's inner should have none
		const circle = screen.getByTestId('circle');
		expect(circle.querySelector('[data-testid="popup"]')).toBeNull();
	});

	it('renders overlays alongside markers', () => {
		mockUseLeaflet.mockReturnValue(loadedResult);
		const markers = [{ lat: 28.83, lng: 50.89, label: 'NPP' }];
		const overlays = [
			{ type: 'circle', center: [28.83, 50.89], radius: 10000 },
			{ type: 'polyline', positions: [[28.9, 50.8], [29.1, 51.0]] },
		];
		render(<Map center={[28.83, 50.89]} markers={markers} overlays={overlays} />);
		expect(screen.getAllByTestId('marker')).toHaveLength(1);
		expect(screen.getByTestId('circle')).toBeTruthy();
		expect(screen.getByTestId('polyline')).toBeTruthy();
	});

	it('renders no overlays when overlays is undefined', () => {
		mockUseLeaflet.mockReturnValue(loadedResult);
		render(<Map center={[0, 0]} />);
		expect(screen.queryByTestId('circle')).toBeNull();
		expect(screen.queryByTestId('polyline')).toBeNull();
		expect(screen.queryByTestId('polygon')).toBeNull();
		expect(screen.queryByTestId('rectangle')).toBeNull();
	});

	it('renders no overlays when overlays is empty array', () => {
		mockUseLeaflet.mockReturnValue(loadedResult);
		render(<Map center={[0, 0]} overlays={[]} />);
		expect(screen.queryByTestId('circle')).toBeNull();
	});

	it('passes pathOptions to overlay components', () => {
		mockUseLeaflet.mockReturnValue(loadedResult);
		const overlays = [{ type: 'circle', center: [0, 0], radius: 1000, color: 'red', fillColor: 'pink', fillOpacity: 0.3 }];
		render(<Map center={[0, 0]} overlays={overlays} />);
		const circle = screen.getByTestId('circle');
		const path = JSON.parse(circle.getAttribute('data-path') ?? '{}');
		expect(path.color).toBe('red');
		expect(path.fillColor).toBe('pink');
		expect(path.fillOpacity).toBe(0.3);
	});

	it('skips invalid overlays gracefully', () => {
		mockUseLeaflet.mockReturnValue(loadedResult);
		const overlays = [
			{ type: 'unknown', center: [0, 0] },
			{ type: 'circle', center: [0, 0], radius: 1000 },
		];
		render(<Map center={[0, 0]} overlays={overlays} />);
		expect(screen.queryAllByTestId('circle')).toHaveLength(1);
	});
});
