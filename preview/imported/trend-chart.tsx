"use client";

// Local interactive fixture; no application services are called.

import { TrendChart } from "../../registry/components/trend-chart";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <TrendChart
          className="w-full"
          label="Visitors by day"
          buckets={Array.from(
            { length: 14 },
            (_, i) => Date.parse("2026-10-01") + i * 86400000,
          )}
          values={[
            120, 140, 180, 160, 220, 280, 240, 320, 290, 350, 310, 420, 450,
            480,
          ]}
          previous={[
            100, 110, 140, 130, 180, 210, 200, 240, 220, 280, 260, 310, 350,
            370,
          ]}
          unit="visitors"
        />
      </div>
    </div>
  );
}
