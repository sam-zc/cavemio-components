"use client";

// Local interactive fixture; no application services are called.

import { ChatScroll } from "../../registry/components/chat-scroll";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <div className="h-80 w-full">
          <ChatScroll className="h-full" contentClassName="grid gap-5 p-5">
            {Array.from({ length: 15 }, (_, i) => (
              <p
                key={i}
                className={i % 2 ? "text-muted-foreground" : "text-right"}
              >
                {i % 2
                  ? "Here is an answer with a little more context."
                  : "Question " + (Math.floor(i / 2) + 1)}
              </p>
            ))}
          </ChatScroll>
        </div>
      </div>
    </div>
  );
}
