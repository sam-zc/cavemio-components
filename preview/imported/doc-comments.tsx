"use client";

// Local interactive fixture; no application services are called.
import * as React from "react";
import { useState } from "react";
import { DocComments } from "../../registry/components/doc-comments";

export function Demo() {
  const [value, setValue] = useState<
    React.ComponentProps<typeof DocComments>["threads"]
  >([]);
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <DocComments
          threads={value}
          onThreadsChange={setValue}
          user={{ id: "ada", name: "Ada Okafor" }}
          onCreate={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
          onReply={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
          onResolve={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        >
          <article className="imported-demo-card">
            <h3>A shared starting point</h3>
            <p>
              Select a sentence to leave a comment. Keep decisions close to the
              work so everyone can follow along.
            </p>
          </article>
        </DocComments>
      </div>
    </div>
  );
}
