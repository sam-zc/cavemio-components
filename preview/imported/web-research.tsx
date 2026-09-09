"use client";

// Local interactive fixture; no application services are called.

import { WebResearch } from "../../registry/components/web-research";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <WebResearch
          status="done"
          queries={["accessible interaction patterns"]}
          sources={[
            {
              url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility",
              title: "Accessibility on the web",
            },
            {
              url: "https://www.w3.org/WAI/",
              title: "Web Accessibility Initiative",
            },
          ]}
        />
      </div>
    </div>
  );
}
