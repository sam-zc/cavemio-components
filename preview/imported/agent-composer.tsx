"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { AgentComposer } from "../../registry/components/agent-composer";

export function Demo() {
  const [message, setMessage] = useState("");
  const [model, setModel] = useState("fast");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <AgentComposer
          model={model}
          onModelChange={setModel}
          branch="main"
          folder="cavemio-web"
          context={{ used: 57000, limit: 128000 }}
          models={[
            { id: "fast", name: "Fast", description: "Everyday questions" },
            {
              id: "reasoning",
              name: "Reasoning",
              description: "Explore a difficult problem",
              reasoning: true,
            },
          ]}
          onSubmit={(text) => setMessage("Sent: " + text)}
        />
        <p role="status" className="imported-demo-feedback">
          {message}
        </p>
      </div>
    </div>
  );
}
