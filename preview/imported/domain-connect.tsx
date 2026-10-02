"use client";

// Local interactive fixture; no application services are called.

import { DomainConnect } from "../../registry/components/domain-connect";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <DomainConnect
          onAdd={async (domain) => ({
            domain,
            status: "pending",
            records: [
              { type: "CNAME", name: "www", value: "cavemio.example.com" },
            ],
          })}
          check={async (domain) => ({ domain, status: "active", records: [] })}
          onRemove={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
