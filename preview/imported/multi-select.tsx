"use client";

// Local interactive fixture; no application services are called.

import { MultiSelect } from "../../registry/components/multi-select";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <MultiSelect
          label="Status"
          defaultValue={["open"]}
          options={[
            { value: "open", label: "Open" },
            { value: "pending", label: "Pending" },
            { value: "closed", label: "Closed" },
          ]}
        />
      </div>
    </div>
  );
}
