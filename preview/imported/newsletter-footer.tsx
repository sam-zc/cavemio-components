"use client";

// Local interactive fixture; no application services are called.

import { NewsletterFooter } from "../../registry/components/newsletter-footer";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <NewsletterFooter
          brand={{
            name: "Cavemio",
            tagline: "Small details. Better interactions.",
          }}
          newsletter={{
            onSubscribe: async () => {
              await new Promise((resolve) => setTimeout(resolve, 650));
            },
          }}
          columns={[
            {
              title: "Product",
              links: [
                { label: "Components", href: "#preview" },
                { label: "Changelog", href: "#preview", badge: "New" },
              ],
            },
            {
              title: "Resources",
              links: [
                { label: "Documentation", href: "#preview" },
                { label: "Community", href: "#preview" },
              ],
            },
          ]}
          legal={[
            { label: "Privacy", href: "#preview" },
            { label: "Terms", href: "#preview" },
          ]}
        />
      </div>
    </div>
  );
}
