"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { MentionInput } from "../../registry/components/mention-menu";

export function Demo() {
  const [message, setMessage] = useState("");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <MentionInput
          triggers={[
            {
              char: "@",
              label: "Context",
              items: [
                { id: "readme", label: "README.md" },
                { id: "page", label: "page.tsx" },
              ],
            },
            {
              char: "/",
              label: "Commands",
              items: [
                { id: "review", label: "Review" },
                { id: "explain", label: "Explain" },
              ],
              startOnly: true,
              variant: "command",
            },
          ]}
          onSubmit={({ text }) => setMessage("Sent: " + text)}
        />
        <p role="status" className="imported-demo-feedback">
          {message}
        </p>
      </div>
    </div>
  );
}
