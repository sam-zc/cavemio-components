"use client";

// Local interactive fixture; no application services are called.

import { VerifyCode } from "../../registry/components/verify-code";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <VerifyCode
          destination="you@example.com"
          onVerify={async (code) => code === "123456"}
          onResend={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
        <p className="text-xs text-muted-foreground">Try 123456.</p>
      </div>
    </div>
  );
}
