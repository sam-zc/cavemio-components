"use client";

// Local interactive fixture; no application services are called.

import { UsageMeter } from "../../registry/components/usage-meter";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <UsageMeter used={760} limit={2000} unit="credits" />
        <UsageMeter
          variant="ring"
          label="Context"
          unit="tokens"
          used={54000}
          limit={128000}
        />
      </div>
    </div>
  );
}
