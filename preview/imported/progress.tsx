"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { Progress } from "../../registry/components/progress";

export function Demo() {
  const [value, setValue] = useState(40);
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Progress
          label="Uploading brief.pdf"
          doneLabel="Uploaded"
          value={value}
        />
        <Progress variant="ring" value={value} />
        <button
          className="imported-demo-button"
          onClick={() => setValue(value >= 100 ? 0 : Math.min(100, value + 20))}
        >
          Advance progress
        </button>
      </div>
    </div>
  );
}
