"use client";

// Local interactive fixture; no application services are called.

import { ApiKeys } from "../../registry/components/api-keys";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <ApiKeys
          defaultValue={[]}
          scopes={[
            { value: "read", label: "Read" },
            { value: "write", label: "Write" },
          ]}
          onCreate={async ({ name, scopes }) => ({
            key: {
              id: "demo-" + Date.now(),
              name,
              scopes,
              createdAt: Date.now(),
              prefix: "demo_",
              last4: "0001",
            },
            secret: "demo_preview_key_only",
          })}
          onRevoke={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
