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

const loadedResult = {
	modules: {
		L: {} as any,
		RL: {
			MapContainer: MockMapContainer,
			TileLayer: MockTileLayer,
			Marker: MockMarker,
			Popup: MockPopup,
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
});
