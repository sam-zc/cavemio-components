"use client";

// Local interactive fixture; no application services are called.

import { FaqAccordion } from "../../registry/components/faq-accordion";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <FaqAccordion
          defaultOpen={[0]}
          items={[
            {
              question: "Can I use these in a client project?",
              answer:
                "Yes. Components are MIT licensed; retain the included notices.",
            },
            {
              question: "Can I edit the source?",
              answer:
                "Every component is copied into your project so you can customize it.",
            },
          ]}
        />
      </div>
    </div>
  );
}
