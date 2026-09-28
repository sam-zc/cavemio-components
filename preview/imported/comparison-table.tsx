"use client";

// Local interactive fixture; no application services are called.

import { ComparisonTable } from "../../registry/components/comparison-table";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <ComparisonTable
          yearlyBadge="Save 20%"
          plans={[
            {
              id: "free",
              name: "Free",
              price: 0,
              cta: { label: "Start free", href: "#preview" },
            },
            {
              id: "pro",
              name: "Pro",
              price: { monthly: 24, yearly: 19 },
              featured: true,
              badge: "Popular",
              cta: { label: "Start a trial", href: "#preview" },
            },
          ]}
          groups={[
            {
              title: "Usage",
              rows: [
                { label: "Projects", values: { free: "3", pro: "Unlimited" } },
              ],
            },
            {
              title: "Security",
              rows: [
                { label: "Single sign-on", values: { free: false, pro: true } },
              ],
            },
          ]}
        />
      </div>
    </div>
  );
}
