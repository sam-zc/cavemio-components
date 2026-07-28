"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { ModeSwitcher } from "../../registry/components/mode-switcher";
import { Zap, Brain, Telescope } from "lucide-react";

export function Demo() {
  const [message, setMessage] = useState("");
  return (
    <div className="cavemio-demo imported-demo imported-demo-compact">
      <div className="imported-demo-stage">
        <ModeSwitcher
          modes={[
            {
              value: "fast",
              label: "Fast",
              icon: <Zap />,
              description: "Quick answers for everyday questions.",
            },
            {
              value: "thinking",
              label: "Thinking",
              icon: <Brain />,
              description: "Takes a moment to reason first.",
            },
            {
              value: "research",
              label: "Research",
              icon: <Telescope />,
              locked: true,
            },
          ]}
          defaultValue="fast"
          showDescription
          onLockedSelect={() =>
            setMessage("Research is available on the next plan.")
          }
        />
        <p role="status" className="imported-demo-feedback">
          {message}
        </p>
      </div>
    </div>
  );
}
