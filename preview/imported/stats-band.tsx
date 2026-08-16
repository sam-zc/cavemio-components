"use client";

// Local interactive fixture; no application services are called.

import { StatsBand } from "../../registry/components/stats-band";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <StatsBand
          stats={[
            {
              value: 12480,
              label: "Teams shipping",
              format: { notation: "compact" },
              suffix: "+",
            },
            { value: 99.98, label: "Uptime", suffix: "%" },
          ]}
        />
      </div>
    </div>
  );
}
