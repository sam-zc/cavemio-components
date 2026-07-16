"use client";

// Local interactive fixture; no application services are called.
import * as React from "react";
import { useState } from "react";
import { FilterBar } from "../../registry/components/filter-bar";

export function Demo() {
  const [value, setValue] = useState<
    NonNullable<React.ComponentProps<typeof FilterBar>["value"]>
  >([]);
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <FilterBar
          fields={[
            {
              id: "status",
              label: "Status",
              type: "option",
              options: [
                { value: "todo", label: "Todo" },
                { value: "done", label: "Done" },
              ],
            },
            { id: "title", label: "Title", type: "text" },
          ]}
          value={value}
          onValueChange={setValue}
          count={8}
          total={12}
          noun={["issue", "issues"]}
        />
      </div>
    </div>
  );
}
