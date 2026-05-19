"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { IconMorphButton } from "../../registry/components/icon-morph";
import { Play, Pause } from "lucide-react";

export function Demo() {
  const [value, setValue] = useState(false);
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <IconMorphButton
          label="Toggle playback"
          active={value}
          onActiveChange={setValue}
          from={<Play size={16} />}
          to={<Pause size={16} />}
        />
      </div>
    </div>
  );
}
