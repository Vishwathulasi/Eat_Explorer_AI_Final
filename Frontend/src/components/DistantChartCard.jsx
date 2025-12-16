import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import "../styles/global.css";

export default function DistantChartCard({ results, onClose }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const buckets = {
    "0 - 1 km": 0,
    "1 - 3 km": 0,
    "3 - 5 km": 0,
  };

  results.forEach((r) => {
    const km = r.distance_m ? r.distance_m / 1000 : r.distance_km || 0;

    if (km <= 1) buckets["0 - 1 km"]++;
    else if (km <= 3) buckets["1 - 3 km"]++;
    else if (km <= 5) buckets["3 - 5 km"]++;
  });

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const newChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(buckets),
        datasets: [
          {
            label: "Number of Restaurants",
            data: Object.values(buckets),
            backgroundColor: ["#FF8A65", "#FF7043", "#FF5722"],
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 14 } } },
          y: { beginAtZero: true, ticks: { stepSize: 1 } },
        },
      },
    });

    chartRef.current = newChart;

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [results]);

  return (
    <div className="overlay-card">
      <div
        className="overlay-content"
        style={{
          maxWidth: "420px",   
          width: "92%",
          padding: "20px",
        }}
      >
        <h3 style={{ marginBottom: 10 }}>📊 Distance Spread</h3>

        <div style={{ width: "100%", height: "260px" }}>
          <canvas ref={canvasRef} />
        </div>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
