"use client";

// Local interactive fixture; no application services are called.

import { EarningsChart } from "../../registry/components/earnings-chart";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <EarningsChart
          title="Earned so far"
          periods={[
            {
              id: "6m",
              label: "6M",
              bars: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map(
                (label, i) => ({
                  key: label,
                  label,
                  value: [6100, 5800, 7400, 9200, 11800, 14900][i],
                }),
              ),
              previous: 32120,
              comparison: "vs the previous six months",
            },
          ]}
        />
      </div>
    </div>
  );
}
