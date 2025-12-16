import "../styles/RestaurantCard.css";

export default function RestaurantCard({ data, onShowRoute }) {
  if (!data) return null;

  return (
    <div className="restaurant-card">
      <div className="restaurant-card-content">

        <div className="card-main">
          <h3>{data.name}</h3>

          <div className="tags">
            <span>⭐ {data.popularity ?? "–"}</span>

            {data.distance_m && (
              <span>📍 {(data.distance_m / 1000).toFixed(1)} km</span>
            )}

            {data.category && <span>{data.category}</span>}
          </div>

          {data.address && <p className="address">{data.address}</p>}
        </div>

        <div className="card-reason">
          <p>{data.reason}</p>

          <div style={{ marginTop: 10 }}>
            <button
              className="route-btn"   
              onClick={() => {
                if (typeof onShowRoute === "function") {
                  onShowRoute(data);   
                }
              }}
            >
              Show Route
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
