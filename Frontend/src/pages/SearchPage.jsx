import { useState, useEffect } from "react";
import { fetchRecommendations, geocodeLocation } from "../services/api";
import SearchBar from "../components/SearchBar";
import ResultsList from "../components/ResultsList";
import MapModal from "../components/MapModal";
import SurpriseButton from "../components/SurpriseButton";
import CompareCard from "../components/CompareCard";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";   
import DistantChartCard from "../components/DistantChartCard";
import "../styles/global.css";
import FoodMoodChips from "../components/FoodMoodChips";

export default function SearchPage() {
 
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const showSnack = (m) => {
    setSnackbarMsg(m);
    setSnackbarOpen(true);
  };

  const [query, setQuery] = useState("");
  const [budget, setBudget] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [maxDistance, setMaxDistance] = useState("");
  const [useLocation, setUseLocation] = useState(true);
  const [locationText, setLocationText] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [mapTarget, setMapTarget] = useState(null);
  const [userCoords, setUserCoords] = useState(null);

  const [compareOpen, setCompareOpen] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);

  const [animatedReason, setAnimatedReason] = useState("");
  const [reasonSentences, setReasonSentences] = useState([]);
  const [reasonDone, setReasonDone] = useState(false);
  const [showCards, setShowCards] = useState(false);

  async function handleLocationTyping(text) {
    setLocationText(text);
    if (text.length < 3) return setSuggestions([]);

    const url =
      `https://nominatim.openstreetmap.org/search?` +
      `q=${encodeURIComponent(text)}` +
      `&format=json&addressdetails=1&countrycodes=in&limit=5`;

    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "FoodFinderApp/1.0" },
      });
      const data = await res.json();
      setSuggestions(Array.isArray(data) ? data : []);
    } catch {
      setSuggestions([]);
    }
  }

  async function handleSubmit() {
    setError("");
    setMessage("");
    setResults([]);

    setAnimatedReason("");
    setReasonDone(false);
    setShowCards(false);

    setLoading(true);  
    setCompareOpen(false);
    setChartOpen(false);

    let lat = null;
    let lng = null;

    if (useLocation) {
      try {
        const coords = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos.coords),
            () => reject("Unable to access location")
          );
        });
        lat = coords.latitude;
        lng = coords.longitude;
        setUserCoords({ lat, lng });
      } catch {
        setError("Unable to access your location");
        setLoading(false);
        return;
      }
    } else {
      if (!locationText.trim()) {
        setError("Please enter a location");
        setLoading(false);
        return;
      }
      try {
        const geo = await geocodeLocation(locationText);
        lat = geo.lat;
        lng = geo.lng;
        setUserCoords({ lat, lng });
      } catch {
        setError("Could not find that location");
        setLoading(false);
        return;
      }
    }

    const payload = {
      query,
      budget: budget ? Number(budget) : null,
      veg_only: vegOnly,
      max_distance_km: maxDistance ? Number(maxDistance) : null,
      limit: 5,
      use_my_location: useLocation,
      location_text: useLocation ? null : locationText,
      lat,
      lng,
    };

    try {
      const data = await fetchRecommendations(payload);
      setResults(data.recommendations || []);
      setMessage(data.message || "");

      const sentences = splitIntoSentences(data.message || "");
      setReasonSentences(sentences);
      animateReason(sentences);
    } catch {
      setError("Failed to fetch results");
    }

    setLoading(false); 
  }

  function splitIntoSentences(text) {
    if (!text) return [];
    return text
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  function animateReason(sentences) {
    setAnimatedReason("");
    setReasonDone(false);
    setShowCards(false);

    let index = 0;

    function next() {
      if (index >= sentences.length) {
        setReasonDone(true);
        setTimeout(() => setShowCards(true), 300);
        return;
      }

      const line = sentences[index];
      if (!line) {
        setReasonDone(true);
        setShowCards(true);
        return;
      }

      setAnimatedReason((prev) => prev + line + "\n\n");
      index++;

      setTimeout(next, 600);
    }

    next();
  }

  function handleSpeakSummary() {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      return;
    }

    if (!message && (!results || results.length === 0)) return;

    const clean = (txt) =>
      txt
        ?.replace(/[^a-zA-Z0-9.,\s]/g, "")  
        .replace(/\s+/g, " ")               
        .trim() || "";


    let spokenText = clean(animatedReason);

  
    if (results.length > 0) {
      spokenText += ". The recommended restaurants are. ";

      results.forEach((r, i) => {
        const name = clean(r.name);
        const addr = clean(r.address);
        const reason = clean(r.reason || "No reason provided");

        spokenText += `${name}. Located at ${addr}. Why recommended. ${reason}. `;

        if (i < results.length - 1) spokenText += " Next. ";
      });
    }

    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(spokenText);
      u.lang = "en-IN";
      window.speechSynthesis.speak(u);
    } catch {}
  }


  function handleOpenCompareButton() {
    setCompareOpen(true);
    showSnack("You can compare top 2 restaurants");
  }

  return (
    <div className="search-page">
      <h1 className="app-title">Eat Explorer</h1>

      <div className="center-row">
        <SearchBar query={query} setQuery={setQuery} onSearch={handleSubmit} loading={loading}/>
      </div>

      <FoodMoodChips setQuery={setQuery} onSearch={handleSubmit} />

      <div className="center-row" style={{ marginTop: -5 }}>
        <label className="toggle">
          <input type="checkbox" checked={useLocation} onChange={() => setUseLocation(!useLocation)} />
          Use My Location
        </label>

        <label className="toggle">
          <input type="checkbox" checked={vegOnly} onChange={() => setVegOnly(!vegOnly)} />
          Veg Only
        </label>
      </div>

      {!useLocation && (
        <div className="manual-location-block">
          <input
            className="manual-location-input"
            placeholder="Enter a location..."
            value={locationText}
            onChange={(e) => handleLocationTyping(e.target.value)}
          />

          {suggestions.length > 0 && (
            <div className="location-dropdown">
              {suggestions.map((item) => (
                <div
                  key={item.place_id}
                  onClick={() => {
                    setLocationText(item.display_name);
                    setSuggestions([]);
                  }}
                >
                  {item.display_name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="filters-row">
        <div className="filter-item">
          <label>Budget (₹)</label>
          <input value={budget} onChange={(e) => setBudget(e.target.value)} />
        </div>

        <div className="filter-item">
          <label>Max Distance (km)</label>
          <input value={maxDistance} onChange={(e) => setMaxDistance(e.target.value)} />
        </div>

        <div className="surprise-col">
          <SurpriseButton
            setQuery={setQuery}
            setBudget={setBudget}
            setMaxDistance={setMaxDistance}
            useLocation={useLocation}
            locationText={locationText}
            userCoords={userCoords}
          />
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {message && (
        <div className="assistant-message">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3>Suggestions for you</h3>

            <div style={{ display: "flex", gap: 8 }}>
              <button className="surprise-btn" onClick={handleSpeakSummary}>
                🔊 Read
              </button>

              {results.length >= 2 && (
                <button
                  className="surprise-btn"
                  onClick={handleOpenCompareButton}
                  style={{ background: "#fff", color: "#e65d00" }}
                >
                  Compare
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
              <CircularProgress color="warning" size={36} />
            </div>
          ) : (
            <p style={{ opacity: reasonDone ? 1 : 0.7, transition: "opacity 0.3s" }}>
              {animatedReason}
            </p>
          )}
        </div>
      )}

      {!loading && reasonDone && (
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <button
            className="surprise-btn"
            onClick={() => {
              setChartOpen(true);
              showSnack("Distance distribution chart opened");
            }}
          >
            📊 Distance Chart
          </button>
        </div>
      )}

      {compareOpen && results.length >= 2 && (
        <CompareCard a={results[0]} b={results[1]} onClose={() => setCompareOpen(false)} />
      )}

      {chartOpen && <DistantChartCard results={results} onClose={() => setChartOpen(false)} />}

      {!loading && showCards && (
        <ResultsList
          results={results}
          loading={loading}
          onShowRoute={(r) => setMapTarget(r)}
          userLocation={userCoords}
        />
      )}

      {mapTarget && userCoords && (
        <MapModal user={userCoords} target={mapTarget} onClose={() => setMapTarget(null)} />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert onClose={() => setSnackbarOpen(false)} severity="info" variant="filled" sx={{ fontSize: "16px" }}>
          {snackbarMsg}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
