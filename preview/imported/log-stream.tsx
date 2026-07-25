"use client";

// Local interactive fixture; no application services are called.

import { LogStream } from "../../registry/components/log-stream";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <LogStream
          defaultValue={[
            {
              id: "1",
              at: Date.parse("2026-10-27T12:00:00Z"),
              level: "info",
              message: "Application started",
            },
            {
              id: "2",
              at: Date.parse("2026-10-27T12:00:01Z"),
              level: "info",
              message: "Connected to the local preview",
            },
            {
              id: "3",
              at: Date.parse("2026-10-27T12:00:02Z"),
              level: "warn",
              message: "A sample warning for inspection",
            },
          ]}
        />
      </div>
    </div>
  );
}
