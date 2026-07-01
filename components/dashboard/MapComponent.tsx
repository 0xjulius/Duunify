"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ResizeHandler() {
  const map = useMap();
  useEffect(() => { setTimeout(() => map.invalidateSize(), 100); }, [map]);
  return null;
}

// Määritellään tyyppi markerille
type MapMarker = {
  position: [number, number];
  name: string;
  count: number;
};

export default function MapComponent({ markers }: { markers: MapMarker[] }) {
  return (
    <MapContainer center={[64.9, 26.5]} zoom={5} className="h-full w-full rounded-xl">
      <ResizeHandler />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
      {markers.map((m, i) => (
        <Marker key={i} position={m.position} icon={icon}>
          <Popup>{m.name}: {m.count} työmahdollisuutta</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}