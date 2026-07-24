"use client";

// Local interactive fixture; no application services are called.

import { LiveMap } from "../../registry/components/live-map";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <LiveMap
          pings={[
            {
              id: 1,
              lat: 38.7,
              lon: -9.1,
              label: "New signup",
              detail: "Lisbon, Portugal",
            },
            {
              id: 2,
              lat: 35.7,
              lon: 139.7,
              label: "New signup",
              detail: "Tokyo, Japan",
            },
          ]}
        />
      </div>
    </div>
  );
}
