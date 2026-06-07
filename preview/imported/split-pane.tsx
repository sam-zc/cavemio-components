"use client";

// Local interactive fixture; no application services are called.

import { SplitPane } from "../../registry/components/split-pane";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <div className="h-72 w-full">
          <SplitPane
            defaultSplit={50}
            first={
              <div className="p-5">
                <strong>Editor</strong>
                <p>Drag the divider to resize.</p>
              </div>
            }
            second={
              <div className="p-5">
                <strong>Preview</strong>
                <p>Both panes stay responsive.</p>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
