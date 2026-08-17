"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { StatusButton } from "../../registry/components/status-button";

export function Demo() {
  const [value, setValue] = useState<"idle" | "pending" | "success" | "error">(
    "idle",
  );
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <StatusButton
          status={value}
          onClick={() => {
            setValue("pending");
            window.setTimeout(() => setValue("success"), 650);
          }}
          onReset={() => setValue("idle")}
        />
      </div>
    </div>
  );
}
