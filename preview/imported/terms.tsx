"use client";

// Local interactive fixture; no application services are called.

import { Terms } from "../../registry/components/terms";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Terms
          version="2026-10-27"
          sections={[
            {
              id: "data",
              title: "Your data",
              tldr: "Your files stay yours.",
              body: (
                <p>
                  This local preview does not collect or transmit your
                  information.
                </p>
              ),
            },
            {
              id: "source",
              title: "Editable source",
              tldr: "Build it your way.",
              body: (
                <p>Keep the MIT license notices when sharing components.</p>
              ),
            },
          ]}
          onAccept={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
