"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { FloatingButtonGroup } from "../../registry/components/floating-button-group";
import { MousePointer, Hand, Square } from "lucide-react";

export function Demo() {
  const [value, setValue] = useState(100);
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <FloatingButtonGroup
          dock="inline"
          tools={[
            {
              id: "select",
              label: "Select",
              icon: <MousePointer size={14} />,
              shortcut: "V",
            },
            {
              id: "hand",
              label: "Hand",
              icon: <Hand size={14} />,
              shortcut: "H",
            },
            {
              id: "frame",
              label: "Frame",
              icon: <Square size={14} />,
              shortcut: "F",
            },
          ]}
          zoomValue={value}
          onZoomChange={setValue}
        />
      </div>
    </div>
  );
}
