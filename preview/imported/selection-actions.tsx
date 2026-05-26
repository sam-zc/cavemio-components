"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { SelectionActions } from "../../registry/components/selection-actions";
import { Sparkles, Scissors } from "lucide-react";

export function Demo() {
  const [value, setValue] = useState(
    "Select a few words in this paragraph to reveal the editing actions. Keep the meaning, and make the expression your own.",
  );
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <SelectionActions
          value={value}
          onValueChange={setValue}
          actions={[
            {
              id: "improve",
              label: "Improve",
              icon: <Sparkles />,
              pendingLabel: "Improving",
            },
          ]}
          more={[
            {
              id: "shorten",
              label: "Shorten",
              icon: <Scissors />,
              pendingLabel: "Shortening",
            },
          ]}
          onAction={async () => "A clear idea, expressed simply."}
        />
      </div>
    </div>
  );
}
