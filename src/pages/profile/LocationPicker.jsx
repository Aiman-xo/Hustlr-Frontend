import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- Fix for Leaflet Default Icon Issue ---
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
// ------------------------------------------

// 1. Helper component to programmatically move the map
function ChangeView({ center }) {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
}

const LocationPicker = ({ onLocationSelected, searchQuery }) => {
    const [position, setPosition] = useState([10.8505, 76.2711]); // Default: Kerala

    // 2. Shared function to fetch address details from coordinates
    const updateLocationDetails = async (lat, lng) => {
        setPosition([lat, lng]);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
                {
                    headers: { 'Accept-Language': 'en' } // Forces English results
                }
            );
            const data = await response.json();
            const shortAddress = data.address.road 
            ? `${data.address.road}, ${data.address.city || data.address.town || ""}`
            : data.display_name;
            
            const locationData = {
                latitude: lat,
                longitude: lng,
                city: data.address.city || data.address.town || data.address.village || data.address.state || "Unknown",
                address: shortAddress.slice(0,95)       
            };

            onLocationSelected(locationData);
        } catch (err) {
            console.error("Geocoding error:", err);
        }
    };

    // 3. Handle Map Clicks
    function ClickHandler() {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                updateLocationDetails(lat, lng);
            },
        });
        return position ? <Marker position={position} /> : null;
    }

    // 4. Handle Search Queries from the parent component
    useEffect(() => {
        const handleSearch = async () => {
            if (!searchQuery) return;

            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&limit=1`,
                    {
                        headers: { 'Accept-Language': 'en' }
                    }
                );
                const data = await response.json();
                
                if (data.length > 0) {
                    const { lat, lon } = data[0];
                    const newLat = parseFloat(lat);
                    const newLng = parseFloat(lon);
                    updateLocationDetails(newLat, newLng);
                }
            } catch (err) {
                console.error("Search fetch error:", err);
            }
        };

        handleSearch();
    }, [searchQuery]);

    return (
        <div className="w-full">
            <div className="h-[300px] w-full rounded-lg border-2 border-gray-300 overflow-hidden">
                <MapContainer 
                    center={position} 
                    zoom={13}
                    style={{ height: '300px', width: '100%' }} 
                    scrollWheelZoom={false} 
                    className="h-full w-full"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    {/* Moves the camera when position changes */}
                    <ChangeView center={position} />
                    <ClickHandler />
                </MapContainer>
            </div>
            <p className="text-xs text-gray-500 mt-1 italic">
                * Click on the map or search above to pin your location.
            </p>
        </div>
    );
};

export default LocationPicker;