"use client";

// Local interactive fixture; no application services are called.

import { CronInput } from "../../registry/components/cron-input";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <CronInput defaultValue="0 9 * * 1-5" />
      </div>
    </div>
  );
}
