import "../styles/SearchBar.css";
import { useState, useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress"; 

export default function SearchBar({ query, setQuery, onSearch, loading }) {  
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  function startVoice() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support voice input.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setQuery(text);
    };

    recognition.onend = () => setListening(false);
  }

  return (
    <div className="searchbar-container">
      <div className="searchbar-box">
        <span className="search-icon">🔍</span>

        <input
          type="text"
          placeholder="Search food… e.g., spicy biryani under 200"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          className={`mic-icon ${listening ? "listening" : ""}`}
          onClick={startVoice}
          type="button"
        >
          🎤
        </button>
      </div>

      <button
        className="search-btn"
        onClick={onSearch}
        disabled={loading}    
      >
        {loading ? (
          <CircularProgress size={22} sx={{ color: "white" }} />
        ) : (
          "Search"
        )}
      </button>
    </div>
  );
}
