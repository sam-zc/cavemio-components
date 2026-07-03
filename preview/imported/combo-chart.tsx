"use client";

// Local interactive fixture; no application services are called.

import { ComboChart } from "../../registry/components/combo-chart";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <ComboChart
          title="Orders"
          days={Array.from({ length: 30 }, (_, i) => ({
            key: "2026-10-" + String(i + 1).padStart(2, "0"),
            label: i + 1 + " Oct",
            value: 80 + ((i * 37) % 160),
          }))}
          previous={3212}
        />
      </div>
    </div>
  );
}
