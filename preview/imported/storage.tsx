"use client";

// Local interactive fixture; no application services are called.

import { Storage } from "../../registry/components/storage";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Storage
          used={2400000000}
          limit={10000000000}
          kinds={[
            { id: "photos", label: "Photos", bytes: 1600000000 },
            { id: "documents", label: "Documents", bytes: 800000000 },
          ]}
        />
      </div>
    </div>
  );
}
