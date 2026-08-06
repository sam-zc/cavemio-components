"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { PromptComposer } from "../../registry/components/prompt-composer";

export function Demo() {
  const [message, setMessage] = useState("");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <PromptComposer
          onSubmit={(text) => setMessage("Sent: " + text)}
          maxLength={4000}
        />
        <p role="status" className="imported-demo-feedback">
          {message}
        </p>
      </div>
    </div>
  );
}
