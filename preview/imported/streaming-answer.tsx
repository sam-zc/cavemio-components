"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import {
  StreamingText,
  AnswerActions,
  FollowUps,
} from "../../registry/components/streaming-answer";

export function Demo() {
  const [message, setMessage] = useState("");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <StreamingText
          content={[
            "Signups are up 23%.",
            { type: "citation", label: "Q3 report" },
            " Churn is down, and more teams are returning.",
          ]}
          status="done"
        />
        <AnswerActions
          copyText="Signups are up 23%. Churn is down."
          onRegenerate={() => setMessage("A new answer was requested")}
        />
        <FollowUps
          items={[
            "Which channels bring the most signups?",
            "Compare with last quarter",
          ]}
          onSelect={setMessage}
        />
        <p role="status" className="imported-demo-feedback">
          {message}
        </p>
      </div>
    </div>
  );
}
