"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { VoiceInput } from "../../registry/components/voice-input";

export function Demo() {
  const [value, setValue] = useState(false);
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <VoiceInput
          status={value ? "listening" : "idle"}
          level={0.45}
          onStart={() => setValue(true)}
          onStop={() => setValue(false)}
          onCancel={() => setValue(false)}
        />
        <p className="text-xs text-muted-foreground">
          Local recording-state preview; no microphone is accessed.
        </p>
      </div>
    </div>
  );
}
