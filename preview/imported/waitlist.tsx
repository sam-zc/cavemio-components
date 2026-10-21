"use client";

// Local interactive fixture; no application services are called.

import { Waitlist } from "../../registry/components/waitlist";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Waitlist
          product="Cavemio"
          onJoin={async () => ({
            position: 128,
            referralLink: "https://example.com/invite/demo",
          })}
        />
      </div>
    </div>
  );
}
