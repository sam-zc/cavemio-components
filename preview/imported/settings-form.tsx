"use client";

// Local interactive fixture; no application services are called.

import { SettingsForm } from "../../registry/components/settings-form";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <SettingsForm
          defaultValue={{ name: "Cavemio", digest: true }}
          sections={[
            {
              title: "Workspace",
              fields: [{ type: "text", name: "name", label: "Name" }],
            },
            {
              title: "Notifications",
              fields: [
                { type: "toggle", name: "digest", label: "Weekly digest" },
              ],
            },
          ]}
          onSave={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
