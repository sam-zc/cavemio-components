"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { SplitButton } from "../../registry/components/split-button";

export function Demo() {
  const [message, setMessage] = useState("");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <SplitButton
          label="Save changes"
          onClick={() => setMessage("Changes saved")}
          menuItems={[
            {
              id: "draft",
              label: "Save as draft",
              onSelect: () => setMessage("Draft saved"),
            },
            {
              id: "export",
              label: "Export backup",
              onSelect: () => setMessage("Backup prepared"),
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
