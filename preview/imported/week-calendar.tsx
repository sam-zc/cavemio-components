"use client";

// Local interactive fixture; no application services are called.
import * as React from "react";
import { useState } from "react";
import { WeekCalendar } from "../../registry/components/week-calendar";

export function Demo() {
  const [value, setValue] = useState<
    React.ComponentProps<typeof WeekCalendar>["events"]
  >([]);
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <WeekCalendar events={value} onEventsChange={setValue} />
      </div>
    </div>
  );
}
