"use client";

// Local interactive fixture; no application services are called.

import { ToggleGroup } from "../../registry/components/toggle-group";
import { Bold, Italic } from "lucide-react";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <ToggleGroup
          label="Format"
          defaultValue={["bold"]}
          options={[
            { value: "bold", label: "Bold", icon: <Bold />, iconOnly: true },
            {
              value: "italic",
              label: "Italic",
              icon: <Italic />,
              iconOnly: true,
            },
          ]}
        />
      </div>
    </div>
  );
}
