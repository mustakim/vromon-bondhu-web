import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Box from '@mui/material/Box';

const MapPicker: React.FC<{ onChange: (lat: number, lng: number) => void }> = ({ onChange }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    setPosition([lat, lng]);
    onChange(lat, lng);
  };

  const SetMarkerOnMapClick = () => {
    const map = useMapEvents({
      click: handleMapClick,
    });
    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    );
  };

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <MapContainer center={[23.87929055104281, 90.26813495606596]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <SetMarkerOnMapClick />
      </MapContainer>
    </Box>
  );
};

export default MapPicker;