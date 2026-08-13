"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { SearchInput } from "../../registry/components/search-input";

export function Demo() {
  const [value, setValue] = useState("");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <SearchInput placeholder="Search components" onSearch={setValue} />
        <p role="status">
          {value ? "Searching for " + value : "Start typing to search"}
        </p>
      </div>
    </div>
  );
}
