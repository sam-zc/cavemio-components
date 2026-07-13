"use client";

// Local interactive fixture; no application services are called.

import { DropZone } from "../../registry/components/drop-zone";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <DropZone
          accept="image/*,.pdf"
          maxSize={10000000}
          maxFiles={3}
          onUpload={async (_file, { progress, signal }) => {
            for (let i = 0; i <= 10; i++) {
              if (signal.aborted) return;
              progress(i / 10);
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
          }}
        />
      </div>
    </div>
  );
}
