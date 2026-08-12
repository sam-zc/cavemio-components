"use client";

// Local interactive fixture; no application services are called.

import { RevenueChart } from "../../registry/components/revenue-chart";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <RevenueChart
          labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
          metrics={[
            {
              id: "revenue",
              label: "Revenue",
              current: [6100, 5800, 7400, 9200, 11800, 14900],
              previous: [4200, 5100, 6200, 7400, 8300, 10000],
              format: { style: "currency", currency: "USD" },
            },
          ]}
        />
      </div>
    </div>
  );
}
