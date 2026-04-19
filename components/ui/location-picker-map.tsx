import { useState, useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet icon missing issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;   
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LocationPickerProps {
    position: { lat: number; lng: number } | null;
    onChange: (lat: number, lng: number, addressDetails?: any) => void;
}

const DEFAULT_CENTER = { lat: 21.028511, lng: 105.804817 }; // Hanoi

function LocationMarker({ position, setPosition }: any) {
  const map = useMapEvents({
      click(e) {
          setPosition(e.latlng);
          map.flyTo(e.latlng, map.getZoom());
      },
  });

  const markerRef = useRef<L.Marker>(null);
  const eventHandlers = useMemo(
      () => ({
          dragend() {
              const marker = markerRef.current;
              if (marker != null) {
                  setPosition(marker.getLatLng());
              }
          },
      }),
      [setPosition]
  );

  return position === null ? null : (
      <Marker
          draggable={true}
          eventHandlers={eventHandlers}
          position={position}
          ref={markerRef}
      ></Marker>
  );
}

export default function LocationPickerMap({ position, onChange }: LocationPickerProps) {
    const [currentPos, setCurrentPos] = useState<L.LatLng | null>(
        position ? L.latLng(position.lat, position.lng) : null
    );

    const isFirstRun = useRef(true);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        if (currentPos) {
             const timer = setTimeout(() => {
                  fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${currentPos.lat}&lon=${currentPos.lng}`)
                     .then(res => res.json())
                     .then(data => {
                         onChange(currentPos.lat, currentPos.lng, data.address);
                     }).catch(e => {
                         onChange(currentPos.lat, currentPos.lng, null);
                     });
             }, 800); // 800ms debounce
             return () => clearTimeout(timer);
        }
    }, [currentPos]);

    return (
        <div style={{ height: "300px", width: "100%", zIndex: 0 }}>
            <MapContainer
                center={currentPos || DEFAULT_CENTER}
                zoom={14}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker position={currentPos} setPosition={setCurrentPos} />
            </MapContainer>
        </div>
    );
}
