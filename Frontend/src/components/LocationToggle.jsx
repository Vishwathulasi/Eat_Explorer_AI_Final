import "../styles/LocationToggle.css";

export default function LocationToggle({ enabled, setEnabled }) {
  return (
    <div className="location-toggle">
      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        Use My Location
      </label>
    </div>
  );
}
