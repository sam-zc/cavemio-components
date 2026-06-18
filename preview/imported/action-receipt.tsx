"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { ActionReceipts } from "../../registry/components/action-receipt";

export function Demo() {
  const [previewNow] = useState(() => Date.now());
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <ActionReceipts
          actions={[
            {
              id: "evt_demo",
              title: "Added design review to Friday",
              detail: "Calendar · 2:00 PM",
              undoUntil: previewNow + 60000,
            },
          ]}
          onUndo={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
