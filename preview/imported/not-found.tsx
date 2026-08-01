"use client";

// Local interactive fixture; no application services are called.

import { NotFound } from "../../registry/components/not-found";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <NotFound
          path="/a-missing-page"
          links={[
            { title: "Components", href: "#preview" },
            { title: "Documentation", href: "#preview" },
          ]}
          search={async (query) => [
            { title: "Search for " + query, href: "#preview" },
          ]}
        />
      </div>
    </div>
  );
}
