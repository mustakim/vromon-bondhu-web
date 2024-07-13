import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Box, Autocomplete, TextField, Typography } from '@mui/material';
import { debounce } from 'lodash';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? '';

const libraries: any[] = ['places'];

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 23.87929055104281,
  lng: 90.26813495606596,
};

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

const MapPicker: React.FC<MapPickerProps> = ({ onLocationSelect }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPosition, setMarkerPosition] = useState(center);
  const [inputValue, setInputValue] = useState('');
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);

  useEffect(() => {
    if (!autocompleteService && window.google) {
      setAutocompleteService(new google.maps.places.AutocompleteService());
    }
  }, [autocompleteService]);

  const handleLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const handlePlacesChanged = async (address: string) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const location = results?.[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        setMarkerPosition({ lat, lng });
        map?.panTo({ lat, lng });
        onLocationSelect(lat, lng);
      }
    });
  };

  const fetchSuggestions = useCallback(
    debounce((input: string) => {
      if (input.length > 0 && autocompleteService) {
        autocompleteService.getPlacePredictions({ input }, (results) => {
          if (results) {
            setSuggestions(results);
          }
        });
      } else {
        setSuggestions([]);
      }
    }, 300),
    [autocompleteService]
  );

  useEffect(() => {
    fetchSuggestions(inputValue);
  }, [inputValue, fetchSuggestions]);

  return (
    <Box>
      <Typography variant="h6">Select Location</Typography>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
        <Autocomplete
          options={suggestions}
          getOptionLabel={(option) => option.description}
          onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
          onChange={(event, newValue) => {
            if (newValue) {
              handlePlacesChanged(newValue.description);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search for places"
              variant="outlined"
              fullWidth
              margin="normal"
            />
          )}
        />
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={markerPosition}
          zoom={8}
          onLoad={handleLoad}
        >
          <Marker
            position={markerPosition}
            draggable
            onDragEnd={(e) => {
              const lat = e.latLng?.lat();
              const lng = e.latLng?.lng();
              if (lat && lng) {
                setMarkerPosition({ lat, lng });
                onLocationSelect(lat, lng);
              }
            }}
          />
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default MapPicker;