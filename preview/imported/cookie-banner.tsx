"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { CookieBanner } from "../../registry/components/cookie-banner";

export function Demo() {
  const [message, setMessage] = useState("");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <CookieBanner
          policyHref="#preview"
          onConsentChange={(consent) =>
            setMessage(
              consent.analytics
                ? "Analytics allowed in this demo"
                : "Preferences saved",
            )
          }
        />
        <p role="status" className="imported-demo-feedback">
          {message}
        </p>
      </div>
    </div>
  );
}
