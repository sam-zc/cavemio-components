"use client";

// Local interactive fixture; no application services are called.
import * as React from "react";

import { MorphingNav } from "../../registry/components/morphing-nav";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo imported-demo-compact">
      <div className="imported-demo-stage">
        <MorphingNav
          items={[
            {
              id: "product",
              label: "Product",
              content: (
                <div className="grid gap-3 p-6">
                  <strong>Build with Cavemio</strong>
                  <p>Editable React components.</p>
                </div>
              ),
            },
            {
              id: "resources",
              label: "Resources",
              content: (
                <div className="p-6">
                  Documentation, examples, and installation guides.
                </div>
              ),
            },
            { id: "pricing", label: "Pricing", href: "#preview" },
          ]}
        />
      </div>
    </div>
  );
}
