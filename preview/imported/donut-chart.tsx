"use client";

// Local interactive fixture; no application services are called.

import { DonutChart } from "../../registry/components/donut-chart";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <DonutChart
          title="Spend by service"
          data={[
            { id: "compute", label: "Compute", value: 5240 },
            { id: "storage", label: "Storage", value: 3180 },
            { id: "bandwidth", label: "Bandwidth", value: 2260 },
          ]}
          format={{
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }}
        />
      </div>
    </div>
  );
}
