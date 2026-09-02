"use client";

// Local interactive fixture; no application services are called.
import * as React from "react";
import { useState } from "react";
import { TimeRangePicker } from "../../registry/components/time-range-picker";

export function Demo() {
  const [value, setValue] = useState<
    React.ComponentProps<typeof TimeRangePicker>["value"]
  >({ type: "relative", duration: 15 * 60000 });
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <TimeRangePicker value={value} onValueChange={setValue} />
      </div>
    </div>
  );
}
