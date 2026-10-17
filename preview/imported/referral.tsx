"use client";

// Local interactive fixture; no application services are called.

import { Referral } from "../../registry/components/referral";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Referral
          link="https://example.com/invite/demo"
          friends={[]}
          goal={3}
          reward="a free month of Pro"
          offer="Friends get 20% off their first year."
          onInvite={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
          onClaim={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
