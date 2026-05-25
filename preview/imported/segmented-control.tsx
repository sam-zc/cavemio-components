"use client";

// Local interactive fixture; no application services are called.

import { SegmentedControl } from "../../registry/components/segmented-control";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <SegmentedControl
          label="View"
          defaultValue="week"
          options={[
            { value: "day", label: "Day" },
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
          ]}
        />
      </div>
    </div>
  );
}
