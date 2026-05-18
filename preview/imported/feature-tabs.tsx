"use client";

// Local interactive fixture; no application services are called.

import { FeatureTabs } from "../../registry/components/feature-tabs";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <FeatureTabs
          tabs={[
            {
              id: "plan",
              label: "Plan",
              content: (
                <div className="imported-demo-card">
                  <h3>Start with a plan.</h3>
                  <p>Keep every next step in view.</p>
                </div>
              ),
            },
            {
              id: "ship",
              label: "Ship",
              content: (
                <div className="imported-demo-card">
                  <h3>Ready for the world.</h3>
                  <p>Make the final details count.</p>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
