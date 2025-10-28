"use client";
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Music, Users } from "lucide-react";

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Venue {
  id: number;
  name: string;
  day: string;
  time: string;
  style: string[];
  address: string;
  lat: number;
  lng: number;
  color: string;
  voices: any[];
}

interface MapViewProps {
  venues: Venue[];
  center: [number, number];
  onVenueClick: (venue: Venue) => void;
  hoveredVenue: number | null;
  setHoveredVenue: (id: number | null) => void;
}

export default function MapView({
  venues,
  center,
  onVenueClick,
  hoveredVenue,
  setHoveredVenue,
}: MapViewProps) {
  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {venues.map((venue) => {
        type VenueColorKey =
          | "bg-purple-500"
          | "bg-red-500"
          | "bg-cyan-500"
          | "bg-indigo-500"
          | "bg-yellow-500"
          | "bg-blue-500"
          | "bg-green-500"
          | "bg-pink-500"
          | "bg-orange-500";
        const colorMap: Record<VenueColorKey, string> = {
          "bg-purple-500": "#8b5cf6",
          "bg-red-500": "#ef4444",
          "bg-cyan-500": "#06b6d4",
          "bg-indigo-500": "#6366f1",
          "bg-yellow-500": "#eab308",
          "bg-blue-500": "#3b82f6",
          "bg-green-500": "#22c55e",
          "bg-pink-500": "#ec4899",
          "bg-orange-500": "#f97316",
        };

        const venueColor = colorMap[venue.color as VenueColorKey] || "#8b5cf6";

        const customIcon = L.divIcon({
          className: "custom-div-icon",
          html: `<div style="
            background-color: ${venueColor};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          "><div style="color: white; font-size: 12px; font-weight: bold;">${venue.name[0]}</div></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        return (
          <Marker
            key={venue.id}
            position={[venue.lat, venue.lng]}
            icon={customIcon}
            eventHandlers={{
              click: () => onVenueClick(venue),
              mouseover: () => setHoveredVenue(venue.id),
              mouseout: () => setHoveredVenue(null),
            }}
          >
            <Popup>
              <div className="p-2">
                <div className="font-bold text-gray-900 text-sm mb-1">
                  {venue.name}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {venue.day}s • {venue.time}
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  {venue.style.join(", ")}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Users size={12} />
                  <span>{venue.voices.length} stories</span>
                </div>
                <button
                  onClick={() => onVenueClick(venue)}
                  className="mt-2 w-full bg-pink-500 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-pink-600"
                >
                  View Stories
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
