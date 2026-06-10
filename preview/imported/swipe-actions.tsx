"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { SwipeActions } from "../../registry/components/swipe-actions";
import { Archive, MailOpen } from "lucide-react";

export function Demo() {
  const [message, setMessage] = useState("");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <SwipeActions
          label="Design review"
          meta="Now"
          leading={[
            {
              id: "read",
              label: "Read",
              icon: <MailOpen />,
              tone: "primary",
              onAction: () => setMessage("Marked as read"),
            },
          ]}
          trailing={[
            {
              id: "archive",
              label: "Archive",
              icon: <Archive />,
              tone: "primary",
              removes: true,
              onAction: () => setMessage("Archived"),
            },
          ]}
        >
          <div className="p-5">
            <strong>The next iteration</strong>
            <p>Swipe this row to reveal its actions.</p>
          </div>
        </SwipeActions>
        <p role="status" className="imported-demo-feedback">
          {message}
        </p>
      </div>
    </div>
  );
}
