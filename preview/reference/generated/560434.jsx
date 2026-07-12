"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency5 from "../../../registry/components/diff-review";
("use strict");
var t = dependency0;
function b(props) {
  return dependency1.createElement(dependency5.DiffReview, props);
}
let k = [
  {
    id: "intro",
    label: "Paragraph 1",
    before:
      "Our onboarding is honestly really good, but a lot of new users just don’t make it past the first screen.",
    after:
      "Our onboarding is strong, but many new users never get past the first screen.",
  },
  {
    id: "plan",
    label: "Paragraph 2",
    before:
      "In order to fix that, we basically need to make sure the first prompt actually does something useful.",
    after:
      "To fix that, the first prompt has to do something useful within seconds.",
  },
  {
    id: "close",
    label: "Closing line",
    before: "Let me know what you think about this.",
    after: "Thoughts by Friday?",
  },
];
let v = [
  {
    id: "fetch",
    label: "lib/answers.ts",
    before: `export async function getAnswer(id: string) {
  const res = await fetch(\`/api/answers/\${id}\`);
  return res.json();
}`,
    after:
      "export async function getAnswer(id: string) {\n  const res = await fetch(`/api/answers/${id}`);\n  if (!res.ok) throw new Error(`Answer ${id}: ${res.status}`);\n  return res.json();\n}",
  },
  {
    id: "retry",
    label: "lib/retry.ts",
    before: `const DELAY = 1000;
const TRIES = 5;`,
    after: `const DELAY = 500;
const TRIES = 3;`,
  },
];
export default (function ({ tab: e = "Text" }) {
  return (0, t.jsx)("div", {
    className: "w-full max-w-[520px]",
    children:
      "Code" === e
        ? (0, t.jsx)(
            b,
            { mode: "lines", changes: v, title: "Suggested fixes" },
            "code",
          )
        : (0, t.jsx)(b, { changes: k }, "text"),
  });
});
