"use client";

// Local interactive fixture; no application services are called.

import { ThinkingIndicator } from "../../registry/components/thinking-indicator";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <ThinkingIndicator variant="orbit" label="Thinking" />
        <ThinkingIndicator variant="dots" label="Working through the details" />
      </div>
    </div>
  );
}
