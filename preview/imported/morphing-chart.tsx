"use client";

// Local interactive fixture; no application services are called.

import { MorphingChart } from "../../registry/components/morphing-chart";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <MorphingChart
          title="Revenue"
          labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
          values={[6100, 5800, 7400, 9200, 11800, 14900]}
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
