"use client";

// Local interactive fixture; no application services are called.

import { Tooltip } from "../../registry/components/tooltip";
import { Archive } from "lucide-react";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Tooltip content="Archive" shortcut="E">
          <button className="imported-demo-button" aria-label="Archive">
            <Archive size={16} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
