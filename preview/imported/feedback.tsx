"use client";

// Local interactive fixture; no application services are called.

import { Feedback } from "../../registry/components/feedback";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Feedback
          question="How likely are you to recommend Cavemio to a friend?"
          onSubmit={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
