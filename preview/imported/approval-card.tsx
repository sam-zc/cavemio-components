"use client";

// Local interactive fixture; no application services are called.

import { ApprovalCard } from "../../registry/components/approval-card";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <ApprovalCard
          title="Send an update to the team"
          description="Review the proposed action before continuing."
          details={[
            { label: "To", value: "team@example.com" },
            { label: "Subject", value: "The next design review" },
          ]}
          onApprove={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
          onDeny={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
