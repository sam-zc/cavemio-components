"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { Wheel, WheelPicker } from "../../registry/components/wheel-picker";

export function Demo() {
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(30);
  const [period, setPeriod] = useState("AM");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <WheelPicker aria-label="Alarm time">
          <Wheel
            label="Hour"
            options={Array.from({ length: 12 }, (_, i) => i + 1)}
            value={hour}
            onValueChange={setHour}
            loop
            align="end"
          />
          <Wheel
            label="Minute"
            options={Array.from({ length: 60 }, (_, i) => ({
              value: i,
              label: String(i).padStart(2, "0"),
            }))}
            value={minute}
            onValueChange={setMinute}
            loop
            align="start"
          />
          <Wheel
            label="AM or PM"
            options={["AM", "PM"] as string[]}
            value={period}
            onValueChange={setPeriod}
          />
        </WheelPicker>
      </div>
    </div>
  );
}
