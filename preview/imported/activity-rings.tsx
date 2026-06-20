"use client";

// Local interactive fixture; no application services are called.

import { ActivityRings } from "../../registry/components/activity-rings";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <ActivityRings
          goals={[
            { id: "orders", label: "Orders", goal: 120 },
            {
              id: "revenue",
              label: "Revenue",
              goal: 1200,
              format: { style: "currency", currency: "USD" },
            },
            { id: "regulars", label: "Regulars back", goal: 15 },
          ]}
          days={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
            (label, i) => ({
              key: "day-" + i,
              label: label[0],
              title: label,
              values: [60 + i * 9, 600 + i * 80, 8 + i],
            }),
          )}
        />
      </div>
    </div>
  );
}
