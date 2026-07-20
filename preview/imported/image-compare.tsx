"use client";

// Local interactive fixture; no application services are called.

import { ImageCompare } from "../../registry/components/image-compare";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <ImageCompare
          before={{ src: "/lifecycle/study-warm.svg", alt: "Warm color study" }}
          after={{ src: "/lifecycle/study-cool.svg", alt: "Cool color study" }}
          beforeLabel="Before"
          afterLabel="After"
        />
      </div>
    </div>
  );
}
