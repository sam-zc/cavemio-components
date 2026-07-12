"use client";

// Local interactive fixture; no application services are called.
import * as React from "react";
import { useState } from "react";
import { DiffReview } from "../../registry/components/diff-review";

export function Demo() {
  const [message, setMessage] = useState("");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <DiffReview
          changes={[
            {
              id: "intro",
              label: "Introduction",
              before: "We make components for building websites.",
              after:
                "Build thoughtful interfaces with editable React components.",
            },
          ]}
          onComplete={() => setMessage("Review complete")}
        />
        <p role="status" className="imported-demo-feedback">
          {message}
        </p>
      </div>
    </div>
  );
}
