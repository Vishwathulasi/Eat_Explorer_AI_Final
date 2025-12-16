import "../styles/FiltersPanel.css";

export default function FiltersPanel({ filters, setFilters }) {
  const update = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="filters-panel">

      <div className="filter-item">
        <label>Budget (₹)</label>
        <input
          type="number"
          value={filters.budget}
          onChange={(e) => update("budget", Number(e.target.value))}
        />
      </div>

      <div className="filter-item">
        <label>Max Distance (km)</label>
        <input
          type="number"
          value={filters.maxDistanceKm}
          onChange={(e) => update("maxDistanceKm", Number(e.target.value))}
        />
      </div>

      <div className="filter-item checkbox">
        <label>
          <input
            type="checkbox"
            checked={filters.vegOnly}
            onChange={(e) => update("vegOnly", e.target.checked)}
          />
          Veg Only
        </label>
      </div>

    </div>
  );
}
