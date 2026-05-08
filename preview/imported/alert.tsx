"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { Alert } from "../../registry/components/alert";

export function Demo() {
  const [message, setMessage] = useState("");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Alert
          tone="warning"
          title="Your card expires soon"
          action={
            <button onClick={() => setMessage("Billing details opened")}>
              Update
            </button>
          }
          onDismiss={() => setMessage("Alert dismissed")}
        >
          Update your payment details to keep your plan.
        </Alert>
        <p role="status" className="imported-demo-feedback">
          {message}
        </p>
      </div>
    </div>
  );
}
