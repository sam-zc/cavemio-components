"use client";

// Local interactive fixture; no application services are called.

import { Input } from "../../registry/components/input";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          hint="We’ll send the receipt here."
          clearable
        />
        <Input label="Workspace" defaultValue="Cavemio" />
      </div>
    </div>
  );
}
