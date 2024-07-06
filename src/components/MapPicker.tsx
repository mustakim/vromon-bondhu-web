import React, { useState, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import Box from "@mui/material/Box";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 23.87929055104281,
  lng: 90.26813495606596,
};

const MapPicker: React.FC<{ onChange: (lat: number, lng: number) => void }> = ({
  onChange,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBv6vi_s6U8DzjFTXlfJiz1C_Y8n9dTFd0",
  });

  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const onLoad = useCallback(function callback(map: any) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMarkerPosition({ lat, lng });
      onChange(lat, lng);
    }
  };

  return isLoaded ? (
    <Box sx={{ height: 400, width: "100%" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </Box>
  ) : (
    <></>
  );
};

export default React.memo(MapPicker);
