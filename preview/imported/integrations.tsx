"use client";

// Local interactive fixture; no application services are called.

import { Integrations } from "../../registry/components/integrations";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Integrations
          defaultValue={[
            {
              id: "calendar",
              name: "Calendar",
              description: "Keep your schedule in sync",
              account: null,
            },
            {
              id: "notes",
              name: "Notes",
              description: "Bring context into your workspace",
              account: null,
            },
          ]}
          onConnect={async () => ({
            name: "Demo account",
            email: "demo@example.com",
          })}
          onDisconnect={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
