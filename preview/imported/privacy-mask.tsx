"use client";

// Local interactive fixture; no application services are called.

import { PrivacyMask } from "../../registry/components/privacy-mask";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <PrivacyMask
          label="Demo API key"
          value="demo_key_cavemio_preview_only"
          autoHideMs={6000}
        />
      </div>
    </div>
  );
}
