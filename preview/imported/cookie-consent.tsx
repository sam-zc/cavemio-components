"use client";

// Local interactive fixture; no application services are called.

import { CookieConsent } from "../../registry/components/cookie-consent";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <CookieConsent
          onSave={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
