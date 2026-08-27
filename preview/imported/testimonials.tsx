"use client";

// Local interactive fixture; no application services are called.

import { Testimonials } from "../../registry/components/testimonials";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Testimonials
          items={[
            {
              quote: "The small details made our product feel complete.",
              name: "Ada Okafor",
              role: "Product designer",
            },
            {
              quote: "Editable source makes it easy to make it our own.",
              name: "Kai Morgan",
              role: "Independent developer",
            },
          ]}
        />
      </div>
    </div>
  );
}
