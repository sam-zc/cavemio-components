"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { AuthCard } from "../../registry/components/auth-card";

export function Demo() {
  const [message, setMessage] = useState("");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <AuthCard
          onEmail={async () => "code" as const}
          onPassword={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
          onCode={async (_email, code) => code === "123456"}
          onSuccess={() => setMessage("Signed in to this local demo")}
        />
        <p role="status" className="imported-demo-feedback">
          {message}
        </p>
      </div>
    </div>
  );
}
