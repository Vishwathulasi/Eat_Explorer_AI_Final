import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import RestaurantCard from "./RestaurantCard";
import RouteMapModal from "./RouteMapModal";

export default function ResultsList({ results, loading, userLocation, onShowRoute }) {
  const [routeOpen, setRouteOpen] = useState(false);
  const [routeDest, setRouteDest] = useState(null); 

  if (loading) return <LoadingSpinner />;

  if (!results || results.length === 0)
    return <div className="empty">No results found</div>;

  function handleShowRoute(place) {
    if (!place || place.lat == null || place.lng == null) {
      console.warn("Missing coords for route:", place);
      return;
    }
    setRouteDest({ lat: place.lat, lng: place.lng, name: place.name });
    setRouteOpen(true);
    if (typeof onShowRoute === "function") onShowRoute(place);
  }

  return (
    <>
      <div className="results-list">
        {results.map((r) => (
          <RestaurantCard
            key={r.place_id || r.name}
            data={r}
            onShowRoute={() => handleShowRoute(r)}
          />
        ))}
      </div>

      {routeOpen && routeDest && (
        <RouteMapModal
          origin={userLocation}
          destination={routeDest}
          onClose={() => {
            setRouteOpen(false);
            setRouteDest(null);
          }}
        />
      )}
    </>
  );
}
