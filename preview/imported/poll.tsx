"use client";

// Local interactive fixture; no application services are called.

import { Poll } from "../../registry/components/poll";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Poll
          question="What should we build next?"
          options={[
            { id: "charts", label: "More charts", votes: 42 },
            { id: "forms", label: "Form components", votes: 28 },
            { id: "agents", label: "Agent interfaces", votes: 35 },
          ]}
          onVote={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
