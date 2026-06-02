"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { Skeleton, SkeletonSwap } from "../../registry/components/skeleton";

export function Demo() {
  const [value, setValue] = useState(false);
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <SkeletonSwap
          loading={!value}
          fallback={
            <div className="grid gap-3">
              <Skeleton shape="circle" />
              <Skeleton width="80%" />
              <Skeleton width="60%" />
            </div>
          }
        >
          <div className="imported-demo-card">
            <strong>Project ready</strong>
            <p>Your workspace has finished loading.</p>
          </div>
        </SkeletonSwap>
        <button
          className="imported-demo-button"
          onClick={() => setValue(!value)}
        >
          {value ? "Show loading" : "Load content"}
        </button>
      </div>
    </div>
  );
}
