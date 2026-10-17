"use client";

// Local interactive fixture; no application services are called.

import { PricingPlans } from "../../registry/components/pricing-plans";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <PricingPlans
          plans={[
            {
              id: "starter",
              name: "Starter",
              price: { monthly: 12, yearly: 9 },
              description: "For your next idea",
              features: ["3 projects", "Editable source"],
            },
            {
              id: "team",
              name: "Team",
              price: { monthly: 24, yearly: 19 },
              description: "Build together",
              features: ["Unlimited projects", "Team collaboration"],
              featured: true,
            },
          ]}
          onCheckout={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
