import React from "react";
import "../styles/global.css"; 

function row(label, a, b) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px dashed rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ flex: 1, color: "#666", minWidth: 140 }}>{label}</div>
      <div style={{ flex: 1 }}>{a}</div>
      <div style={{ flex: 1 }}>{b}</div>
    </div>
  );
}

export default function CompareCard({ a, b, onClose }) {
  if (!a || !b) return null;

  const aDistance = a.distance_m
    ? `${(a.distance_m / 1000).toFixed(1)} km`
    : a.distance_km
    ? `${a.distance_km} km`
    : "–";

  const bDistance = b.distance_m
    ? `${(b.distance_m / 1000).toFixed(1)} km`
    : b.distance_km
    ? `${b.distance_km} km`
    : "–";

  const aRating = a.popularity ?? a.rating ?? "–";
  const bRating = b.popularity ?? b.rating ?? "–";

  const aPrice = a.price
    ? `₹${a.price}`
    : a.estimated_price
    ? `₹${a.estimated_price}`
    : "–";

  const bPrice = b.price
    ? `₹${b.price}`
    : b.estimated_price
    ? `₹${b.estimated_price}`
    : "–";

  function cleanReason(text) {
    if (!text) return "—";

    const cleaned = text
      .split(".")
      .filter((sentence) => !sentence.toLowerCase().includes("reviews highlight"))
      .join(". ")
      .trim();

    return cleaned.length > 0 ? cleaned : "—";
  }

  return (
    <div className="compare-overlay" role="dialog" aria-modal="true">
      <div
        className="compare-card"
        style={{ maxWidth: 920, width: "calc(100% - 40px)" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h4 style={{ margin: 0 }}>Compare — Top 2 recommendations</h4>

          <button
            onClick={onClose}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 8,
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1 }} />
          <div style={{ flex: 1, fontWeight: 700, textAlign: "center" }}>
            {a.name}
          </div>
          <div style={{ flex: 1, fontWeight: 700, textAlign: "center" }}>
            {b.name}
          </div>
        </div>

        {row("Rating", aRating, bRating)}
        {row("Price (approx.)", aPrice, bPrice)}
        {row("Distance", aDistance, bDistance)}
        {row("Category", a.category || "–", b.category || "–")}
        {row(
          "Address",
          a.address || a.display_name || "–",
          b.address || b.display_name || "–"
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <div style={{ flex: 1, color: "#666" }}>Why one over the other</div>

          <div style={{ flex: 1 }}>
            {cleanReason(a.reason)}
          </div>

          <div style={{ flex: 1 }}>
            {cleanReason(b.reason)}
          </div>
        </div>
      </div>
    </div>
  );
}
