"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { Price, PricingToggle } from "../../registry/components/pricing-toggle";

export function Demo() {
  const [value, setValue] = useState("monthly");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <PricingToggle value={value} onValueChange={setValue} />
        <Price
          amount={value === "yearly" ? 23 : 29}
          note={value === "yearly" ? "$276 billed yearly" : "Billed monthly"}
        />
      </div>
    </div>
  );
}
