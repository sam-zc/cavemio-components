"use client";

// Local interactive fixture; no application services are called.

import { OnboardingChecklist } from "../../registry/components/onboarding-checklist";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <OnboardingChecklist
          tasks={[
            {
              id: "menu",
              title: "Add your first project",
              description: "Bring an idea to life.",
              action: {
                label: "Create project",
                pendingLabel: "Creating",
                onClick: async () => {
                  await new Promise((resolve) => setTimeout(resolve, 650));
                },
              },
            },
            {
              id: "team",
              title: "Invite your team",
              action: {
                label: "Invite",
                onClick: async () => {
                  await new Promise((resolve) => setTimeout(resolve, 650));
                },
              },
            },
          ]}
        />
      </div>
    </div>
  );
}
