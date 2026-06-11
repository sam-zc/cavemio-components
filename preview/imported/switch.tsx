"use client";

// Local interactive fixture; no application services are called.

import { Switch } from "../../registry/components/switch";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Switch
          label="Weekly digest"
          description="A summary every Monday."
          labelPosition="start"
          defaultChecked
        />
      </div>
    </div>
  );
}
