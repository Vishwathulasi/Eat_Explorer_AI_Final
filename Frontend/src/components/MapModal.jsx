import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/MapModel.css";

export default function MapModal({ user, target, onClose }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!user || !target) return;

    const { lat: userLat, lng: userLng } = user;
    const { lat: restLat, lng: restLng } = target;

    if (mapInstance.current) {
      mapInstance.current.remove();
    }

    mapInstance.current = L.map(mapRef.current).setView([userLat, userLng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapInstance.current);

    L.marker([userLat, userLng])
      .addTo(mapInstance.current)
      .bindPopup("You are here");

    L.marker([restLat, restLng])
      .addTo(mapInstance.current)
      .bindPopup(target.name);

    L.polyline(
      [
        [userLat, userLng],
        [restLat, restLng],
      ],
      { color: "orange", weight: 5 }
    ).addTo(mapInstance.current);
  }, [user, target]);

  return (
    <div className="map-modal-overlay">
      <div className="map-modal">
        <button className="close-btn" onClick={onClose}>✖</button>

        <h3>Route to {target.name}</h3>

        <div ref={mapRef} className="map-container"></div>
      </div>
    </div>
  );
}
