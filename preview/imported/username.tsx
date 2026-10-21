"use client";

// Local interactive fixture; no application services are called.

import { Username } from "../../registry/components/username";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Username
          check={async (name) => ({ available: name.length > 3 })}
          onClaim={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
