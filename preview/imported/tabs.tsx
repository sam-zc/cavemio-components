"use client";

// Local interactive fixture; no application services are called.

import { Tabs } from "../../registry/components/tabs";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Tabs
          label="Settings"
          items={[
            {
              value: "general",
              label: "General",
              content: <p className="p-5">Your workspace settings.</p>,
            },
            {
              value: "billing",
              label: "Billing",
              content: (
                <p className="p-5">Your next invoice is on November 1.</p>
              ),
            },
            {
              value: "members",
              label: "Members",
              count: 8,
              content: <p className="p-5">8 people build here together.</p>,
            },
          ]}
        />
      </div>
    </div>
  );
}
