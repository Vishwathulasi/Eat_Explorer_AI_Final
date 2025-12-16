import { useEffect, useState } from "react";

export default function useGeolocation() {
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLoading(false);
      },
      () => setLoading(false)
    );
  }, []);

  return { ...coords, loading };
}
