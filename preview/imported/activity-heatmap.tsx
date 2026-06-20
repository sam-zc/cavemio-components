"use client";

// Local interactive fixture; no application services are called.

import { ActivityHeatmap } from "../../registry/components/activity-heatmap";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <ActivityHeatmap
          data={Array.from({ length: 180 }, (_, i) => ({
            date: new Date(Date.parse("2026-05-01") + i * 86400000)
              .toISOString()
              .slice(0, 10),
            value: (i * 17) % 23,
          }))}
          unit={{ one: "contribution", other: "contributions" }}
        />
      </div>
    </div>
  );
}
