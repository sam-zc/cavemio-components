"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/thinking-trace";
("use strict");
var t = dependency0;
var s = dependency1;
var n = dependency2;
let r = {
  Steps: {
    variant: "steps",
    steps: [
      { label: "Reading the product brief" },
      { label: "Scanning support tickets" },
      { label: "Comparing customer feedback", detail: "6 accounts" },
      { label: "Writing the summary" },
    ],
  },
  Reasoning: {
    variant: "reasoning",
    steps: [
      {
        label:
          "Signups climb after every pricing change, with annual plans in the lead.",
      },
      {
        label:
          "I should check support volume before suggesting a wider rollout.",
      },
    ],
  },
  Search: {
    variant: "search",
    query: "onboarding checklist examples",
    more: 7,
    steps: [
      {
        label: "Onboarding Atlas",
        detail: "onboardingatlas.com",
        href: "https://onboardingatlas.com/",
      },
      {
        label: "Product Patterns",
        detail: "productpatterns.io",
        href: "https://productpatterns.io/",
      },
      {
        label: "Growth Ledger",
        detail: "growthledger.com",
        href: "https://growthledger.com/",
      },
    ],
  },
  Tools: {
    variant: "tools",
    steps: [
      { label: "Read", detail: "src/data/plans.ts" },
      {
        label: "Edit",
        detail: "src/components/PricingTable.tsx",
        additions: 74,
        deletions: 41,
      },
      { label: "Run", detail: "npm test" },
    ],
  },
  Error: {
    variant: "tools",
    failAt: 2,
    steps: [
      { label: "Read", detail: "src/data/plans.ts" },
      {
        label: "Edit",
        detail: "src/components/PricingTable.tsx",
        additions: 12,
        deletions: 3,
      },
      { label: "Run", detail: "npm test" },
    ],
  },
};
export default (function ({ tab: e = "Steps" }) {
  let i = r[e] ?? r.Steps,
    [a] = (0, s.useState)(() => Date.now()),
    [l, o] = (0, s.useState)(0),
    [d, c] = (0, s.useState)("running");
  (0, s.useEffect)(() => {
    let e = void 0 !== i.failAt ? i.failAt + 1 : i.steps.length,
      t = Array.from({ length: e }, (e, t) =>
        window.setTimeout(() => o(t + 1), 700 + 800 * t),
      );
    return (
      t.push(
        window.setTimeout(
          () => c(void 0 !== i.failAt ? "error" : "done"),
          700 + 800 * e + 700,
        ),
      ),
      () => t.forEach((e) => window.clearTimeout(e))
    );
  }, [i]);
  let u = i.steps
    .slice(0, l)
    .map((e, t) =>
      i.failAt === t && "error" === d ? { ...e, status: "error" } : e,
    );
  return (0, t.jsx)("div", {
    className: "flex min-h-[196px] w-full max-w-[400px] flex-col justify-start",
    children: (0, t.jsx)(n.ThinkingTrace, {
      variant: i.variant,
      status: d,
      startedAt: a,
      steps: u,
      query: i.query,
      more: "done" === d ? i.more : void 0,
    }),
  });
});
