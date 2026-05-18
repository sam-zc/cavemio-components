"use client";

// Local interactive fixture; no application services are called.

import { HoverCard } from "../../registry/components/hover-card";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <HoverCard
          content={
            <div className="p-4">
              <strong>Ada Okafor</strong>
              <p>Product designer · Building with Cavemio.</p>
            </div>
          }
        >
          <a href="#preview" className="underline">
            @ada
          </a>
        </HoverCard>
      </div>
    </div>
  );
}
