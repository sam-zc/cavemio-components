"use client";

// Local interactive fixture; no application services are called.

import { DeleteWorkspace } from "../../registry/components/delete-workspace";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <DeleteWorkspace
          name="Demo workspace"
          onDelete={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
