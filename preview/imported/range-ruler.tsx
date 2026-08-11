"use client";

// Local interactive fixture; no application services are called.

import { RangeRuler } from "../../registry/components/range-ruler";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <RangeRuler
          label="Price interval"
          min={0}
          max={500}
          step={5}
          unit="$"
          defaultValue={[50, 250]}
        />
      </div>
    </div>
  );
}
