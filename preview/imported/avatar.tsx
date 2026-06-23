"use client";

// Local interactive fixture; no application services are called.

import { Avatar, AvatarGroup } from "../../registry/components/avatar";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Avatar name="Ada Okafor" status="online" />
        <AvatarGroup
          people={[
            { name: "Ada Okafor" },
            { name: "Kai Morgan" },
            { name: "Maya Chen" },
            { name: "Noor Ali" },
            { name: "Leo Park" },
          ]}
          max={3}
        />
      </div>
    </div>
  );
}
