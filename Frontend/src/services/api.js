const API_URL = import.meta.env.VITE_API_URL;

export async function fetchRecommendations(payload) {
  const res = await fetch(`${API_URL}/api/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch results: ${text || res.status}`);
  }

  return res.json();
}

export async function detectMood(payload) {
  const res = await fetch(`${API_URL}/api/mood`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Mood endpoint failed");
  return res.json();
}

export async function geocodeLocation(text) {
  if (!text || !text.trim()) {
    throw new Error("Location text is empty");
  }

  const res = await fetch(`${API_URL}/api/geocode`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ location_text: text }),
  });

  if (!res.ok) {
    let msg = `Geocoding failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data && data.error) msg = data.error;
    } catch {
      
    }
    throw new Error(msg);
  }

  return res.json();
}
