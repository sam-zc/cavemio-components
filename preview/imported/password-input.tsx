"use client";

// Local interactive fixture; no application services are called.

import { PasswordInput } from "../../registry/components/password-input";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <PasswordInput
          label="New password"
          strength
          autoComplete="new-password"
        />
      </div>
    </div>
  );
}
