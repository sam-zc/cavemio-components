"use client";

// Local interactive fixture; no application services are called.

import { Textarea } from "../../registry/components/textarea";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Textarea label="Bio" placeholder="Tell your story…" maxLength={160} />
      </div>
    </div>
  );
}
