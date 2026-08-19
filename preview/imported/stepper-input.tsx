"use client";

// Local interactive fixture; no application services are called.

import { StepperInput } from "../../registry/components/stepper-input";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <StepperInput
          label="Workspace seats"
          defaultValue={5}
          min={1}
          max={50}
          unit="seats"
        />
      </div>
    </div>
  );
}
