"use client";

// Local interactive fixture; no application services are called.

import { StepsChart } from "../../registry/components/steps-chart";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <StepsChart
          goal={10000}
          weeks={[
            {
              id: "week",
              label: "This week",
              days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (label, i) => ({
                  key: label,
                  label,
                  value: [4200, 7600, 10300, 8500, 6180, 12000, 9200][i],
                  today: i === 4,
                }),
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
