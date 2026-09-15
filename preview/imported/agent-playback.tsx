"use client";

// Local interactive fixture; no application services are called.

import { AgentPlayback } from "../../registry/components/agent-playback";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <AgentPlayback
          turns={[
            {
              prompt: "Summarise this week’s churn",
              steps: [
                {
                  type: "thinking",
                  steps: ["Reading the events", "Grouping by plan"],
                },
                {
                  type: "tool",
                  name: "run_query",
                  input: { table: "events", since: "7d" },
                  output: { rows: 1284 },
                },
                {
                  type: "answer",
                  content:
                    "Churn fell to 2.1% this week, mostly on the Starter plan.",
                },
              ],
            },
          ]}
          header="Cavemio"
        />
      </div>
    </div>
  );
}
