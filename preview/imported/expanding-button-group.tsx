"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { ExpandingButtonGroup } from "../../registry/components/expanding-button-group";
import { Download, Link2, Trash2 } from "lucide-react";

export function Demo() {
  const [message, setMessage] = useState("");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <ExpandingButtonGroup
          items={[
            {
              id: "download",
              label: "Download",
              icon: <Download size={14} />,
              confirmLabel: "Saved",
            },
            {
              id: "link",
              label: "Copy link",
              icon: <Link2 size={14} />,
              confirmLabel: "Copied",
            },
            {
              id: "delete",
              label: "Delete",
              icon: <Trash2 size={14} />,
              tone: "danger",
              confirm: "Delete?",
              onClick: () => setMessage("Removed from this demo"),
            },
          ]}
        />
        <p role="status" className="imported-demo-feedback">
          {message}
        </p>
      </div>
    </div>
  );
}
