"use client";

// Local interactive fixture; no application services are called.

import { CodeBlock } from "../../registry/components/code-block";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <CodeBlock
          code={
            'export function greet(name: string) {\n  return "Hello, " + name;\n}'
          }
          language="ts"
          filename="lib/greet.ts"
        />
      </div>
    </div>
  );
}
