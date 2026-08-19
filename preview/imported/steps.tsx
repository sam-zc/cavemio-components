"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { Steps } from "../../registry/components/steps";

export function Demo() {
  const [value, setValue] = useState(1);
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Steps
          current={value}
          steps={[
            { label: "Cart" },
            { label: "Details" },
            { label: "Payment" },
            { label: "Done" },
          ]}
        />
        <button
          className="imported-demo-button"
          onClick={() => setValue((value + 1) % 4)}
        >
          Next step
        </button>
      </div>
    </div>
  );
}
