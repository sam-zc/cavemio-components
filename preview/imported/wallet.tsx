"use client";

// Local interactive fixture; no application services are called.

import { Wallet } from "../../registry/components/wallet";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Wallet
          name="Kai Morgan"
          balance={2480}
          contacts={[
            { id: "ada", name: "Ada Okafor" },
            { id: "maya", name: "Maya Chen" },
          ]}
          transactions={[]}
          onSend={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
          onRequest={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
