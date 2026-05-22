"use client";

// Local interactive fixture; no application services are called.

import { RadioGroup } from "../../registry/components/radio-group";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <RadioGroup
          label="Plan"
          variant="cards"
          defaultValue="team"
          options={[
            {
              value: "personal",
              label: "Personal",
              description: "For your own projects",
              aside: "Free",
            },
            {
              value: "team",
              label: "Team",
              description: "Build together",
              aside: "$24",
            },
          ]}
        />
      </div>
    </div>
  );
}
