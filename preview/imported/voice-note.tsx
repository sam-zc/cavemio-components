"use client";

// Local interactive fixture; no application services are called.

import { VoiceNote } from "../../registry/components/voice-note";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <VoiceNote
          src="/lifecycle/voice-preview.wav"
          label="Voice note preview"
          unread
          transcript={[
            { text: "A", start: 0.1 },
            { text: "short", start: 0.6 },
            { text: "audio", start: 1.1 },
            { text: "preview.", start: 1.7 },
          ]}
        />
      </div>
    </div>
  );
}
