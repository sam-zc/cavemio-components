"use client";

// Local interactive fixture; no application services are called.

import { Combobox } from "../../registry/components/combobox";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Combobox
          label="Assignee"
          placeholder="Assign someone"
          search={async (q) =>
            [
              { value: "ada", label: "Ada Okafor", description: "Design" },
              { value: "kai", label: "Kai Morgan", description: "Engineering" },
              { value: "maya", label: "Maya Chen", description: "Product" },
            ].filter((person) =>
              person.label.toLowerCase().includes(q.toLowerCase()),
            )
          }
        />
      </div>
    </div>
  );
}
