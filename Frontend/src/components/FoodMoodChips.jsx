import "../styles/FoodMoodChips.css";

export default function FoodMoodChips({ setQuery, onSearch }) {
  const moods = [
    { label: "Cheesy", icon: "🧀", query: "I need something cheesy near me" },
    { label: "Spicy", icon: "🌶️", query: "Recommend spicy food within 3 km" },
    { label: "South Indian", icon: "🍛", query: "South Indian food nearby" },
    { label: "Fast Food", icon: "🍔", query: "Fast food near me" },
    { label: "Dessert", icon: "🍰", query: "Dessert places near me" },
    { label: "Cafe", icon: "☕", query: "Cafe and snacks near me" }
  ];

  function handleClick(q) {
    setQuery(q);
    setTimeout(() => onSearch(), 200);
  }

  return (
    <div className="mood-chip-container">
      {moods.map((m) => (
        <div
          key={m.label}
          className="mood-chip"
          onClick={() => handleClick(m.query)}
        >
          <span className="chip-icon">{m.icon}</span>
          <span>{m.label}</span>
        </div>
      ))}
    </div>
  );
}
