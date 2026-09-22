"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { ChatNotice } from "../../registry/components/chat-notice";

export function Demo() {
  const [previewNow] = useState(() => Date.now());
  const [message, setMessage] = useState("");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <ChatNotice
          kind="rate-limit"
          resetAt={previewNow + 3600000}
          onUpgrade={() => setMessage("Plan options opened")}
        />
        <ChatNotice
          kind="error"
          details="504 · demo_request"
          onRetry={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
        <p role="status" className="imported-demo-feedback">
          {message}
        </p>
      </div>
    </div>
  );
}
