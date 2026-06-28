"use client";

// Local interactive fixture; no application services are called.

import { ChangelogTrace } from "../../registry/components/changelog-trace";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <ChangelogTrace
          entries={[
            {
              id: "library",
              date: "2026-10-27",
              version: "v2.8",
              title: "A bigger component library",
              tags: ["new"],
              body: <p>More editable components for your next project.</p>,
            },
            {
              id: "motion",
              date: "2026-10-20",
              version: "v2.7",
              title: "Motion that follows you",
              tags: ["improved"],
              body: <p>Interruptible transitions and keyboard controls.</p>,
            },
          ]}
        />
      </div>
    </div>
  );
}
