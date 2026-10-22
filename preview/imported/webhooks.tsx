"use client";

// Local interactive fixture; no application services are called.

import { Webhooks } from "../../registry/components/webhooks";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Webhooks
          defaultValue={[]}
          events={[{ value: "invoice.paid" }, { value: "customer.created" }]}
          onTest={async (_endpoint, event) => ({
            id: "delivery-demo",
            event,
            status: 200,
            at: Date.now(),
            duration: 140,
          })}
          onCreate={async (input) => ({
            ...input,
            id: "demo-" + Date.now(),
            createdAt: Date.now(),
            secret: "demo_webhook_secret",
          })}
        />
      </div>
    </div>
  );
}
