"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { LiveLineChart } from "../../registry/components/live-line-chart";

export function Demo() {
  const [now] = useState(() => Date.now());
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <LiveLineChart
          label="Requests"
          unit="req/s"
          data={Array.from({ length: 60 }, (_, i) => ({
            t: now - (59 - i) * 1000,
            value: 900 + Math.sin(i / 5) * 200 + ((i * 13) % 80),
          }))}
          threshold={{ value: 1200, label: "Rate limit" }}
        />
      </div>
    </div>
  );
}
