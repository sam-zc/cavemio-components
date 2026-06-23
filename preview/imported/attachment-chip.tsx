"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { AttachmentChip } from "../../registry/components/attachment-chip";

export function Demo() {
  const [value, setValue] = useState(false);
  const [message, setMessage] = useState("");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <AttachmentChip
          name="project-brief.pdf"
          type="application/pdf"
          size={2400000}
          status={value ? "ready" : "uploading"}
          progress={0.42}
          onRemove={() => setMessage("Attachment removed")}
        />
        <button
          className="imported-demo-button"
          onClick={() => setValue(!value)}
        >
          Toggle upload state
        </button>
        <p role="status" className="imported-demo-feedback">
          {message}
        </p>
      </div>
    </div>
  );
}
