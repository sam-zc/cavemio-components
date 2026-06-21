"use client";

// Local interactive fixture; no application services are called.

import { AreaChart } from "../../registry/components/area-chart";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <AreaChart
          title="Orders"
          caption="over the last six months"
          labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
          series={[
            {
              id: "counter",
              label: "Counter",
              values: [120, 150, 180, 160, 220, 280],
            },
            { id: "app", label: "App", values: [60, 80, 100, 140, 130, 180] },
            {
              id: "delivery",
              label: "Delivery",
              values: [40, 50, 70, 60, 90, 120],
            },
          ]}
        />
      </div>
    </div>
  );
}
