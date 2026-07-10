"use client";

// Local interactive fixture; no application services are called.

import { DatePicker } from "../../registry/components/date-picker";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <DatePicker label="Due date" />
      </div>
    </div>
  );
}
