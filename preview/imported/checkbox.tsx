"use client";

// Local interactive fixture; no application services are called.

import { Checkbox } from "../../registry/components/checkbox";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Checkbox
          label="Email me about new components"
          description="A short update when something new ships."
          defaultChecked
        />
        <Checkbox label="Include source files" />
      </div>
    </div>
  );
}
