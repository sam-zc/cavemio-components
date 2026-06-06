"use client";

// Local interactive fixture; no application services are called.

import { Sparkline } from "../../registry/components/sparkline";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Sparkline
          data={[12, 14, 18, 16, 22, 28, 24, 32]}
          height={40}
          variant="area"
          prefix="$"
        />
      </div>
    </div>
  );
}
