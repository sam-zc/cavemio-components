"use client";

// Local interactive fixture; no application services are called.

import { CsvImport } from "../../registry/components/csv-import";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <CsvImport
          noun={{ one: "contact", many: "contacts" }}
          fields={[
            { key: "name", label: "Name", required: true },
            { key: "email", label: "Email", required: true, match: ["e-mail"] },
          ]}
          onImport={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
