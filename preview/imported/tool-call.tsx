"use client";

// Local interactive fixture; no application services are called.

import { ToolCall } from "../../registry/components/tool-call";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <ToolCall
          name="search_flights"
          title="Search flights"
          status="done"
          duration={1240}
          input={{ from: "BLR", to: "LIS", date: "2026-11-02" }}
          output={{ cheapest: "€412", airline: "Example Air" }}
        />
      </div>
    </div>
  );
}
