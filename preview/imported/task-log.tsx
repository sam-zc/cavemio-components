"use client";

// Local interactive fixture; no application services are called.

import { TaskLog } from "../../registry/components/task-log";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <TaskLog
          tasks={[
            {
              id: "find",
              title: "Finding project files",
              doneTitle: "Found project files",
              status: "done",
              steps: [
                { id: "1", text: "Read", file: "page.tsx" },
                { id: "2", text: "Scanned", detail: "52 files" },
              ],
            },
            {
              id: "edit",
              title: "Updating the sidebar",
              doneTitle: "Updated sidebar",
              status: "done",
              steps: [
                { id: "3", text: "Edited", file: "component-sidebar.tsx" },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}
