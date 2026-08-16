"use client";

// Local interactive fixture; no application services are called.

import { StatusBars } from "../../registry/components/status-bars";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <StatusBars
          services={[
            {
              id: "api",
              name: "API",
              status: "operational",
              uptime: 99.98,
              days: Array.from({ length: 30 }, (_, i) => ({
                date: "2026-10-" + String(i + 1).padStart(2, "0"),
                status:
                  i === 12 ? ("degraded" as const) : ("operational" as const),
              })),
            },
          ]}
        />
      </div>
    </div>
  );
}
