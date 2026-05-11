"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { ButtonGroup } from "../../registry/components/button-group";

export function Demo() {
  const [value, setValue] = useState("grid");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <ButtonGroup
          items={[
            {
              id: "grid",
              label: "Grid",
              active: value === "grid",
              onClick: () => setValue("grid"),
            },
            {
              id: "list",
              label: "List",
              active: value === "list",
              onClick: () => setValue("list"),
            },
            {
              id: "columns",
              label: "Columns",
              active: value === "columns",
              onClick: () => setValue("columns"),
            },
          ]}
        />
      </div>
    </div>
  );
}
