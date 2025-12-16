import React, { useState, useRef } from "react";
import { fetchRecommendations } from "../services/api";
import "../styles/SurpriseButton.css";

export default function SurpriseButton({
  setQuery,
  setBudget,
  setMaxDistance,
  useLocation,
  locationText,
  userCoords,
}) {
  const [open, setOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wheelResult, setWheelResult] = useState(null);
  const [wheelSuggestions, setWheelSuggestions] = useState([]);
  const wheelRef = useRef(null);

  const wheelSectors = [
    { label: "Dosa", offer: "10% OFF" },
    { label: "Biryani", offer: "20% OFF" },
    { label: "Pizza", offer: "No Luck" },
    { label: "Chaat", offer: "Free Drink" },
    { label: "Samosa", offer: "5% OFF" },
    { label: "Idli", offer: "No Luck" },
    { label: "Burger", offer: "30% OFF" },
    { label: "Dessert", offer: "No Luck" },
  ];

  function openPanel() {
    setOpen(true);
    setWheelResult(null);
    setWheelSuggestions([]);
    setRotation(0);
    setIsSpinning(false);
  }

  function closePanel() {
    setOpen(false);
    setIsSpinning(false);
  }

  async function resolveCoords() {
    if (userCoords && userCoords.lat != null && userCoords.lng != null) {
      return userCoords;
    }
    if (!useLocation) {
      return null;
    }
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      try {
        const coords = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos.coords),
            (err) => reject(err),
            { timeout: 8000 }
          );
        });
        return { lat: coords.latitude, lng: coords.longitude };
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  async function finalizePick(picked, randBudget, randDist) {
    const coupon =
      picked.offer && picked.offer !== "No Luck"
        ? `FF-${picked.label.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
        : null;

    const resultObj = {
      food: picked.label,
      budget: String(randBudget),
      distance: String(randDist),
      offer: picked.offer,
      coupon,
    };

    try {
      if (typeof setQuery === "function") setQuery(resultObj.food);
      if (typeof setBudget === "function") setBudget(resultObj.budget);
      if (typeof setMaxDistance === "function") setMaxDistance(resultObj.distance);
    } catch (e) {
      console.warn("Failed to apply surprise result to parent fields", e);
    }

    setWheelResult(resultObj);

    const coords = await resolveCoords();

    try {
      const payload = {
        query: resultObj.food,
        budget: Number(resultObj.budget) || null,
        veg_only: false,
        max_distance_km: Number(resultObj.distance) || 10,
        limit: 3,
        use_my_location: useLocation,
        location_text: useLocation ? null : locationText,
        lat: coords ? coords.lat : null,
        lng: coords ? coords.lng : null,
      };

      const data = await fetchRecommendations(payload);
      const recs = data && Array.isArray(data.recommendations) ? data.recommendations : [];
      setWheelSuggestions(recs.slice(0, 3));
    } catch (e) {
      console.error("Wheel fetch failed", e);
      setWheelSuggestions([]);
    }
  }

  async function handleSpin() {
    if (isSpinning) return;
    setIsSpinning(true);
    setWheelResult(null);
    setWheelSuggestions([]);

    const sectors = wheelSectors.length;
    const targetIndex = Math.floor(Math.random() * sectors);
    const spins = 6 + Math.floor(Math.random() * 3);
    const anglePer = 360 / sectors;
    const targetAngle = targetIndex * anglePer + anglePer / 2;
    const finalRotation = -(spins * 360 + targetAngle);

    setRotation((r) => {
      const normalized = r % 360;
      return normalized;
    });

    await new Promise((r) => setTimeout(r, 20));

    setRotation(finalRotation);

    await new Promise((r) => setTimeout(r, 4600 + 200));

    const randBudget = (Math.floor(Math.random() * 5) + 1) * 100; 
    const randDist = Math.floor(Math.random() * 10) + 1; 
    const picked = wheelSectors[targetIndex];

    await finalizePick(picked, randBudget, randDist);

    setIsSpinning(false);

    setTimeout(() => {
      setOpen(false);
    }, 6000);
  }

  async function handleRandomPick() {
    if (isSpinning) return;

    setIsSpinning(true);
    setWheelResult(null);
    setWheelSuggestions([]);

    const sectors = wheelSectors.length;
    const targetIndex = Math.floor(Math.random() * sectors);
    const randBudget = (Math.floor(Math.random() * 5) + 1) * 100;
    const randDist = Math.floor(Math.random() * 10) + 1;
    const picked = wheelSectors[targetIndex];

    setRotation((r) => r - (Math.floor(Math.random() * 60) + 30));

    await finalizePick(picked, randBudget, randDist);

    setIsSpinning(false);

  }

  function renderWheelSuggestions() {
    if (!wheelSuggestions || wheelSuggestions.length === 0) {
      return <div className="sw-no-picks">No nearby places found.</div>;
    }
    return (
      <ul className="sw-picks-list">
        {wheelSuggestions.map((r, i) => (
          <li key={i} className="sw-pick">
            <strong>{r.name || r.title || "Unknown"}</strong>
            <div className="sw-pick-meta">
              {r.address || r.display_name
                ? (r.address ? stringifyAddress(r.address) : r.display_name)
                : r.vicinity || r.formatted_address || ""}
            </div>
            <div className="sw-pick-meta-small">
              {r.distance_km ? `${r.distance_km} km • ` : ""}
              {r.price ? `₹${r.price}` : ""}
            </div>
          </li>
        ))}
      </ul>
    );
  }

  function stringifyAddress(address) {
    if (!address) return "";
    if (typeof address === "string") return address;
    const parts = [];
    if (address.road) parts.push(address.road);
    if (address.suburb) parts.push(address.suburb);
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    return parts.join(", ");
  }

  return (
    <>
      <button className="sw-open-btn" onClick={openPanel} aria-expanded={open}>
        🎁 Surprise Me
      </button>

      <div className={`sw-overlay ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className={`sw-panel ${open ? "open" : ""}`} role="dialog" aria-modal="true">
          <div className="sw-header">
            <div>
              <div className="sw-title">Spin & Surprise</div>
              <div className="sw-sub">Try your luck — auto-fill fields if you win</div>
            </div>
            <button className="sw-close" onClick={closePanel} aria-label="Close panel">
              ✕
            </button>
          </div>

          <div className="sw-area">
            <div className="sw-wheel-wrap" aria-hidden={isSpinning ? "false" : "false"}>
              <div
                ref={wheelRef}
                className="sw-wheel"
                style={{ transform: `rotate(${rotation}deg)` }}
                aria-live="polite"
                aria-atomic="true"
              >
                <div className="sw-wheel-labels">
                  {wheelSectors.map((s, i) => {
                    const angle = (360 / wheelSectors.length) * i;
                    return (
                      <div
                        key={i}
                        className="sw-sector"
                        style={{ transform: `rotate(${angle}deg) translate(-100%, -50%)` }}
                      >
                        {s.label}
                      </div>
                    );
                  })}
                </div>
                <div className="sw-center">🎲</div>
              </div>

              <div className="sw-pointer">▼</div>
            </div>

            <div className="sw-actions">
              <button
                className="sw-spin-btn"
                onClick={handleSpin}
                disabled={isSpinning}
                aria-disabled={isSpinning}
              >
                {isSpinning ? "Spinning…" : "Spin"}
              </button>

              <div className="sw-info" aria-live="polite">
                <div className="sw-info-top">
                  {wheelResult
                    ? `${wheelResult.food} • ${wheelResult.budget ? `₹${wheelResult.budget}` : ""} • ${
                        wheelResult.distance ? `${wheelResult.distance}km` : ""
                      }`
                    : "Random pick will fill the form"}
                </div>

                <div className="sw-info-bottom">
                  {wheelResult ? (
                    <>
                      <div>
                        <strong>Offer:</strong> {wheelResult.offer}
                      </div>
                      {wheelResult.coupon && (
                        <div>
                          <strong>Coupon:</strong> <code className="sw-coupon">{wheelResult.coupon}</code>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="sw-hint">Click spin to get a surprise food + budget + distance.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="sw-footer-note">
            If an offer appears, use the coupon at any of the picks above (validity subject to restaurant).
          </div>
        </div>
      </div>
    </>
  );
}