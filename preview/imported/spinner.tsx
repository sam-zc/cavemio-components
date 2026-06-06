"use client";

// Local interactive fixture; no application services are called.

import { Spinner } from "../../registry/components/spinner";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <div className="flex items-center gap-8">
          <Spinner />
          <Spinner variant="dots" size="md" label="Writing a reply" />
        </div>
      </div>
    </div>
  );
}
