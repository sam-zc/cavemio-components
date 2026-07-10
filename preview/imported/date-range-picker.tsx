"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { DateRangePicker } from "../../registry/components/date-range-picker";

export function Demo() {
  const [value, setValue] = useState<{ start: Date; end: Date }>({
    start: new Date("2026-10-01"),
    end: new Date("2026-10-27"),
  });
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <DateRangePicker value={value} onValueChange={setValue} />
      </div>
    </div>
  );
}
