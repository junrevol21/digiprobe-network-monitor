import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { MapMarker, TestMetrics } from '@/types/network';
import { getOperatorLetter, getCategoryBorderColor } from '@/lib/quality';
import { RadarChartComponent } from './RadarChart';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface TestMapProps {
  markers: MapMarker[];
  showPolyline?: boolean;
  center?: [number, number];
  zoom?: number;
}

function createCustomIcon(operatorLabel: string, categoryColor: 'blue' | 'green' | 'yellow' | 'red'): L.DivIcon {
  const { letter, color: innerColor } = getOperatorLetter(operatorLabel);
  const borderColor = getCategoryBorderColor(categoryColor);

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: ${borderColor};
        border: 3px solid ${borderColor};
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          color: ${innerColor};
          font-family: 'Inter', sans-serif;
        ">
          ${letter}
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

function MapUpdater({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  
  return null;
}

export function TestMap({ markers, showPolyline = false, center, zoom = 13 }: TestMapProps) {
  const defaultCenter: [number, number] = center || [-7.7956, 110.3695]; // Yogyakarta

  const polylinePositions = showPolyline && markers.length > 1
    ? markers.map(m => [m.lat, m.lng] as [number, number])
    : [];

  const getPolylineColor = () => {
    if (markers.length === 0) return '#0EA5E9';
    const lastMarker = markers[markers.length - 1];
    return getCategoryBorderColor(lastMarker.categoryColor);
  };

  return (
    <div className="h-[300px] rounded-xl overflow-hidden shadow-lg border border-border">
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        className="h-full w-full"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={center} zoom={zoom} />
        
        {showPolyline && polylinePositions.length > 1 && (
          <Polyline
            positions={polylinePositions}
            pathOptions={{
              color: getPolylineColor(),
              weight: 4,
              opacity: 0.8,
            }}
          />
        )}
        
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={createCustomIcon(marker.operatorLabel, marker.categoryColor)}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-sm mb-2">{marker.operatorLabel}</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {new Date(marker.timestamp).toLocaleString()}
                </p>
                <RadarChartComponent metrics={marker.metrics} size={180} />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
