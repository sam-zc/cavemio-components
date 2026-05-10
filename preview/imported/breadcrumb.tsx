"use client";

// Local interactive fixture; no application services are called.

import { Breadcrumb } from "../../registry/components/breadcrumb";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Breadcrumb
          items={[
            { label: "Projects", href: "#preview" },
            { label: "Cavemio", href: "#preview" },
            { label: "Assets" },
          ]}
        />
      </div>
    </div>
  );
}
