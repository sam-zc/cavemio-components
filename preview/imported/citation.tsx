"use client";

// Local interactive fixture; no application services are called.

import { Citation } from "../../registry/components/citation";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <p>
          Accessible interfaces start with native controls.
          <Citation
            index={1}
            source={{
              title: "Web accessibility",
              url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility",
              snippet: "Build interfaces that work for everyone.",
            }}
          />
        </p>
      </div>
    </div>
  );
}
