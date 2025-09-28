"use client";

import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

// Simple world topojson (react-simple-maps built-in url)
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type Point = { name: string; coordinates: [number, number]; count?: number };

export function GeoMap({ points }: { points: Point[] }) {
  return (
    <div className="bg-[#0F1517] border border-[#1E2A29] rounded-xl p-5">
      <div className="text-sm uppercase tracking-widest text-[#9BCDBA] mb-3">Geographic Distribution</div>
      <div className="h-72">
        <ComposableMap projectionConfig={{ scale: 150 }} style={{ width: "100%", height: "100%" }}>
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => (
                <Geography key={geo.rsmKey} geography={geo} style={{ default: { fill: "#0B1012", outline: "none", stroke: "#1E2A29" }, hover: { fill: "#0D1113", outline: "none" } }} />
              ))
            }
          </Geographies>
          {points.map((p) => (
            <Marker key={p.name} coordinates={p.coordinates}>
              <circle r={3} fill="#0CF29D" stroke="#00C776" strokeWidth={1} />
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>
  );
}

