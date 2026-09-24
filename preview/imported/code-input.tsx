"use client";

// Local interactive fixture; no application services are called.

import { CodeInput } from "../../registry/components/code-input";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <CodeInput
          groups={[3, 3]}
          onComplete={async (code) => code === "123456"}
          onResend={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
        <p className="text-xs text-muted-foreground">
          Use 123456 to try verification.
        </p>
      </div>
    </div>
  );
}
