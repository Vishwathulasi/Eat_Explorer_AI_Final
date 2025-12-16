import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import "../styles/RouteMapModal.css";

export default function RouteMapModal({ origin, destination, onClose }) {
  const mapRef = useRef(null);
  const controlRef = useRef(null);

  const destNameSafe = destination?.name ? destination.name : `dest-${Date.now()}`;
  const containerId = `route-map-${destNameSafe.replace(/\s+/g, "-").toLowerCase()}`;

  useEffect(() => {
  
    if (
      !origin ||
      origin.lat == null ||
      origin.lng == null ||
      !destination ||
      destination.lat == null ||
      destination.lng == null
    ) {
      console.warn("Missing coords", origin, destination);
      return;
    }

    try {
     
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const map = L.map(containerId, {
        center: [origin.lat, origin.lng],
        zoom: 13,
        preferCanvas: true,
      });

      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      
      const SafeRouter = L.Routing.control({
        waypoints: [
          L.latLng(origin.lat, origin.lng),
          L.latLng(destination.lat, destination.lng),
        ],
        routeWhileDragging: false,
        showAlternatives: false,
        fitSelectedRoute: true,
        lineOptions: {
          addWaypoints: false,
          styles: [{ color: "#ff6b00", weight: 5 }],
        },
        createMarker: (i, wp) => {
          const el = L.divIcon({
            className: i === 0 ? "marker-origin" : "marker-dest",
            html: i === 0 ? "You" : "Dest",
            iconSize: [40, 14],
            iconAnchor: [20, 7],
          });
          return L.marker(wp.latLng, { icon: el });
        },

        addWaypoints: false,
        router: L.Routing.osrmv1({
          serviceUrl: "https://router.project-osrm.org/route/v1",
          timeout: 10000,
          profile: "driving",
        }),
      });

      SafeRouter.on("routesfound", () => {

        if (!map) return;
      });

      SafeRouter.on("routingerror", (e) => {
        console.warn("Routing error:", e);
      });

      SafeRouter.addTo(map);

      controlRef.current = SafeRouter;
    } catch (err) {
      console.error("Map init error:", err);
    }

    return () => {
      try {
        if (controlRef.current) {
          controlRef.current.remove();
          controlRef.current = null;
        }
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      } catch {}
    };

  }, [origin?.lat, origin?.lng, destination?.lat, destination?.lng]);

  if (
    !origin ||
    origin.lat == null ||
    origin.lng == null ||
    !destination ||
    destination.lat == null ||
    destination.lng == null
  ) {
    return null;
  }

  return (
    <div className="route-modal-backdrop" onClick={onClose}>
      <div
        className="route-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="route-modal-header">
          <h3>Route to {destination.name}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div id={containerId} className="route-map-container" />

        <div className="route-modal-footer">
          <p>
            From: {origin.lat.toFixed(5)}, {origin.lng.toFixed(5)} — To:{" "}
            {destination.lat.toFixed(5)}, {destination.lng.toFixed(5)}
          </p>
        </div>
      </div>
    </div>
  );
}
