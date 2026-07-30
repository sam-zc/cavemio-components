"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { ModelPicker } from "../../registry/components/model-picker";

export function Demo() {
  const [value, setValue] = useState("fast");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <ModelPicker
          models={[
            {
              id: "fast",
              name: "Fast",
              description: "Everyday questions",
              speed: 3,
              intelligence: 2,
            },
            {
              id: "reasoning",
              name: "Reasoning",
              description: "Think through a hard problem",
              speed: 1,
              intelligence: 3,
              reasoning: true,
            },
          ]}
          value={value}
          onValueChange={setValue}
        />
      </div>
    </div>
  );
}
