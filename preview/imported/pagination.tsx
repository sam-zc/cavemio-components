"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { Pagination } from "../../registry/components/pagination";

export function Demo() {
  const [value, setValue] = useState(1);
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Pagination page={value} pageCount={12} onPageChange={setValue} />
      </div>
    </div>
  );
}
