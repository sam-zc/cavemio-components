"use client";

// Local interactive fixture; no application services are called.

import { DataTable } from "../../registry/components/data-table";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <DataTable
          columns={[
            {
              key: "company",
              header: "Customer",
              sortable: true,
              searchable: true,
            },
            { key: "mrr", header: "MRR", align: "right", sortable: true },
          ]}
          rows={[
            { id: "1", company: "Acme", mrr: 240 },
            { id: "2", company: "Orbit", mrr: 480 },
            { id: "3", company: "Layers", mrr: 120 },
          ]}
          noun={["customer", "customers"]}
          selectable
        />
      </div>
    </div>
  );
}
