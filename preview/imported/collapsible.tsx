"use client";

// Local interactive fixture; no application services are called.

import { Collapsible } from "../../registry/components/collapsible";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <div className="imported-demo-card">
          <p>Project overview</p>
          <Collapsible labels={{ closed: "Show details", open: "Show less" }}>
            <p className="mt-4">
              Editable source, shared motion primitives, accessible controls,
              and local previews.
            </p>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}
