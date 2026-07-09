"use client";

// Local interactive fixture; no application services are called.

import { CopyButton } from "../../registry/components/copy-button";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <CopyButton text="npx shadcn add @cavemio/button" showLabel />
      </div>
    </div>
  );
}
