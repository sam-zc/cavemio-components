"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { Button } from "../../registry/components/button";

export function Demo() {
  const [value, setValue] = useState(false);
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => setValue(!value)}>
            {value ? "Saved" : "Save changes"}
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>
    </div>
  );
}
