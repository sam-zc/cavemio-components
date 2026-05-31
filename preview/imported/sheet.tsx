"use client";

// Local interactive fixture; no application services are called.

import { Sheet } from "../../registry/components/sheet";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Sheet
          trigger={
            <button className="imported-demo-button">Open filters</button>
          }
          side="right"
          title="Filters"
        >
          <div className="grid gap-4 p-6">
            <label>
              <input type="checkbox" /> Only open projects
            </label>
            <label>
              <input type="checkbox" /> Assigned to me
            </label>
          </div>
        </Sheet>
      </div>
    </div>
  );
}
