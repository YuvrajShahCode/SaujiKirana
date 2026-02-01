"use client"

import React, { useState, useMemo, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { Loader } from "@/components/ui/Loader";
import { Button } from "@/components/ui/Button";
import { MapPin } from "lucide-react";

const LIBRARIES = ["places"];

export default function AddressPicker({ onSelectLocation }) {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", // Graceful fallback
        libraries: LIBRARIES,
    });

    const [center, setCenter] = useState({ lat: 27.7172, lng: 85.3240 }); // Kathmandu default
    const [selectedLocation, setSelectedLocation] = useState(null);

    const mapContainerStyle = useMemo(() => ({
        width: '100%',
        height: '400px',
        borderRadius: '0.5rem',
    }), []);

    const onMapClick = useCallback((e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setSelectedLocation({ lat, lng });
    }, []);

    const handleConfirm = () => {
        if (onSelectLocation && selectedLocation) {
            onSelectLocation(selectedLocation);
        }
    };

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setCenter(pos);
                    setSelectedLocation(pos);
                },
                () => {
                    alert("Error getting location");
                }
            );
        }
    };

    if (loadError) return <div className="p-4 text-red-500">Error loading maps</div>;
    if (!isLoaded) return <div className="p-4 flex justify-center"><Loader /></div>;

    return (
        <div className="flex flex-col gap-4">
            <div className="relative border rounded-lg overflow-hidden">
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    zoom={14}
                    center={center}
                    onClick={onMapClick}
                    options={{
                        disableDefaultUI: false,
                        zoomControl: true,
                        streetViewControl: false,
                    }}
                >
                    {selectedLocation && <Marker position={selectedLocation} />}
                </GoogleMap>

                <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2 shadow-md z-10"
                    onClick={handleCurrentLocation}
                >
                    <MapPin className="mr-1 h-3 w-3" /> My Location
                </Button>
            </div>

            <div className="flex justify-end gap-2">
                <div className="flex-1 text-xs text-muted-foreground p-2">
                    {selectedLocation
                        ? `Selected: ${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`
                        : "Tap on map to select location"
                    }
                </div>
                <Button onClick={handleConfirm} disabled={!selectedLocation}>
                    Confirm Location
                </Button>
            </div>
        </div>
    );
}
