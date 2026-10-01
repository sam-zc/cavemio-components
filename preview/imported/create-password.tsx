"use client";

// Local interactive fixture; no application services are called.

import { CreatePassword } from "../../registry/components/create-password";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <CreatePassword
          username="you@example.com"
          onSubmit={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
