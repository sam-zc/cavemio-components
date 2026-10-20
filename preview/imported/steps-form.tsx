"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { StepsForm } from "../../registry/components/steps-form";

export function Demo() {
  const [value, setValue] = useState("Cavemio");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <StepsForm
          steps={[
            {
              id: "name",
              label: "Workspace",
              title: "Name your workspace",
              content: (
                <input
                  className="imported-demo-input"
                  aria-label="Workspace name"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              ),
              validate: () => (value.trim() ? null : "Give it a name."),
            },
            {
              id: "plan",
              label: "Plan",
              title: "Pick your plan",
              content: <p>Free · All components and editable source.</p>,
            },
          ]}
          onSubmit={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
          submitLabels={{
            idle: "Create workspace",
            pending: "Creating",
            success: "Created",
          }}
          done={<p>Your workspace is ready.</p>}
        />
      </div>
    </div>
  );
}
