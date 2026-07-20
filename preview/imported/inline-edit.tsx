"use client";

// Local interactive fixture; no application services are called.

import { InlineEdit } from "../../registry/components/inline-edit";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <div className="text-2xl font-semibold">
          <InlineEdit
            label="Project name"
            defaultValue="Cavemio web"
            onSave={async () => {
              await new Promise((resolve) => setTimeout(resolve, 650));
            }}
          />
        </div>
      </div>
    </div>
  );
}
