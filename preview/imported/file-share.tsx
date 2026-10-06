"use client";

// Local interactive fixture; no application services are called.

import { FileShare } from "../../registry/components/file-share";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <FileShare
          onUpload={async (file, { onProgress }) => {
            onProgress(1);
            return {
              id: "demo-" + Date.now(),
              name: file.name,
              size: file.size,
            };
          }}
          onCreateLink={async () => ({ url: "https://example.com/share/demo" })}
        />
      </div>
    </div>
  );
}
