"use client";

// Local interactive fixture; no application services are called.

import { Slider } from "../../registry/components/slider";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Slider label="Volume" defaultValue={60} />
        <Slider
          label="Price"
          min={0}
          max={200}
          step={5}
          defaultValue={[40, 120]}
          format={(v) => "$" + v}
        />
      </div>
    </div>
  );
}
