"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { NotificationInbox } from "../../registry/components/notification-inbox";

export function Demo() {
  const [previewNow] = useState(() => Date.now());
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <NotificationInbox
          defaultValue={[
            {
              id: "1",
              title: "Design review",
              body: "Ada mentioned you in a comment.",
              at: previewNow - 60000,
              read: false,
            },
            {
              id: "2",
              title: "Workspace ready",
              body: "Your team can start building.",
              at: previewNow - 3600000,
              read: true,
            },
          ]}
          onRead={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
          onArchive={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
