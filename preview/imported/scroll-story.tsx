"use client";

// Local interactive fixture; no application services are called.

import { ScrollStory } from "../../registry/components/scroll-story";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <ScrollStory
          steps={[
            {
              title: "Pick a component",
              body: "Start with editable source.",
              visual: <div className="imported-demo-card">01 · Choose</div>,
            },
            {
              title: "Make it yours",
              body: "Bring your own content and theme.",
              visual: <div className="imported-demo-card">02 · Customize</div>,
            },
            {
              title: "Go live",
              body: "Ship the interaction.",
              visual: <div className="imported-demo-card">03 · Publish</div>,
            },
          ]}
        />
      </div>
    </div>
  );
}
