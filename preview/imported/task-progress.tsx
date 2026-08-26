"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { TaskProgress } from "../../registry/components/task-progress";

export function Demo() {
  const [message, setMessage] = useState("");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <TaskProgress
          title="Exploring the component library"
          status="running"
          phases={["Searching", "Reading", "Writing"]}
          phase={1}
          stats={[
            { label: "sources", value: 42 },
            { label: "read", value: 12 },
          ]}
          message="Gathering the details."
          onCancel={() => setMessage("Task cancelled in this demo")}
        />
        <p role="status" className="imported-demo-feedback">
          {message}
        </p>
      </div>
    </div>
  );
}
