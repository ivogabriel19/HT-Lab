import { useState } from "react";

export default function LineChart({
  data,
  max,
  label,
}: {
  data: number[];
  max: number;
  label: string;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <div style={{ position: "relative", backgroundColor: "var(--neutro-soft)", padding: 12 }}>
      <div
        style={{
          display: "flex",
          gap: 4,
          alignItems: "flex-end",
          height: 140,
        }}
      >
        {data.map((v, i) => {
          const h = (v / max) * 100;

          return (
            <div
              key={i}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "flex-end",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: `${h}%`,
                  background: i === hoverIndex ? "#60a5fa" : "#3b82f6",
                  borderRadius: 4,
                  transition: "0.15s",
                }}
              />

              {/* Tooltip */}
              {hoverIndex === i && (
                <div
                  style={{
                    position: "absolute",
                    bottom: `${h}%`,
                    left: "50%",
                    transform: "translate(-50%, -10px)",
                    background: "#0f172a",
                    color: "#f8fafc",
                    padding: "6px 10px",
                    borderRadius: 6,
                    fontSize: 12,
                    whiteSpace: "nowrap",
                    zIndex: 10,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                    border: "1px solid #F5CA09",
                    pointerEvents: "none",
                  }}
                >
                  #{i + 1} • {label}: <strong>{v}</strong>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
