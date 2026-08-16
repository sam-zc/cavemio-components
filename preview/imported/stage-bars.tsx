"use client";

// Local interactive fixture; no application services are called.

import { StageBars } from "../../registry/components/stage-bars";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <StageBars
          title="App orders"
          stages={[
            { id: "opened", label: "Opened the app" },
            { id: "basket", label: "Added to basket" },
            { id: "paid", label: "Paid" },
          ]}
          periods={[
            { id: "week", label: "This week", values: [2480, 1164, 611] },
          ]}
        />
      </div>
    </div>
  );
}
