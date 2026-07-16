"use client";

// Local interactive fixture; no application services are called.

import { ExpandingGallery } from "../../registry/components/expanding-gallery";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <ExpandingGallery
          label="Color studies"
          images={[
            {
              id: "a",
              src: "/lifecycle/study-warm.svg",
              alt: "Warm geometric color study",
              title: "Afternoon study",
              width: 1200,
              height: 800,
            },
            {
              id: "b",
              src: "/lifecycle/study-cool.svg",
              alt: "Cool geometric color study",
              title: "Quiet morning",
              width: 1200,
              height: 800,
            },
          ]}
        />
      </div>
    </div>
  );
}
