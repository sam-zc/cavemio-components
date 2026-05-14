"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { DropdownMenu } from "../../registry/components/dropdown-menu";

export function Demo() {
  const [message, setMessage] = useState("");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <DropdownMenu
          trigger={
            <button className="imported-demo-button">More actions</button>
          }
          items={[
            {
              id: "rename",
              label: "Rename",
              shortcut: "F2",
              onSelect: () => setMessage("Rename selected"),
            },
            { type: "separator" },
            {
              id: "delete",
              label: "Delete",
              destructive: true,
              onSelect: () => setMessage("Delete selected"),
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
