"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { Badge } from "../../registry/components/badge";

export function Demo() {
  const [value, setValue] = useState(3);
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="success" dot>
            Paid
          </Badge>
          <Badge tone="warning" dot>
            Pending
          </Badge>
          <Badge tone="primary" count={value} />
          <button
            className="imported-demo-button"
            onClick={() => setValue(value + 1)}
          >
            Add notification
          </button>
        </div>
      </div>
    </div>
  );
}
