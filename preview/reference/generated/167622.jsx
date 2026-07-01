"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency5 from "../../../registry/components/clarifying-question";
("use strict");
var t = dependency0;
var n = dependency1;
function x(props) {
  return dependency1.createElement(dependency5.ClarifyingQuestion, props);
}
let f = [
  {
    id: "main",
    label: "Main Street",
    description: "The original shop, open since 2009",
  },
  {
    id: "harbour",
    label: "Harbour Road",
    description: "The new one, opening Saturday",
  },
  {
    id: "both",
    label: "Both shops",
    description: "One plan, split by location",
  },
];
let b = [
  { id: "instagram", label: "Instagram" },
  { id: "email", label: "Email list", description: "2,400 subscribers" },
  { id: "flyers", label: "Flyers on the street" },
  { id: "press", label: "Local press" },
];
export default (function ({ tab: e = "Single" }) {
  let [r, s] = (0, n.useState)(null),
    [i, a] = (0, n.useState)(!1),
    o = "Multiple" === e,
    l = r ? [...r.labels, r.other].filter(Boolean).join(", ") : "";
  return (0, t.jsxs)("div", {
    className: "flex w-full max-w-[440px] flex-col gap-3",
    children: [
      (0, t.jsx)("p", {
        className: "text-[13.5px] leading-relaxed text-foreground",
        children: o
          ? "I’ll draft the launch posts. Where should they go?"
          : "I can draft the opening week plan. One thing first:",
      }),
      "Answered" === e
        ? (0, t.jsx)(x, {
            question: "Which shop is this plan for?",
            options: f,
            answer: { ids: ["harbour"], labels: ["Harbour Road"] },
            onAnswer: () => {},
          })
        : (0, t.jsx)(x, {
            question: o
              ? "Which channels should the launch use?"
              : "Which shop is this plan for?",
            detail: o ? "Pick any. I’ll write one version for each." : void 0,
            options: o ? b : f,
            multiple: o,
            onAnswer: s,
            onSkip: () => a(!0),
          }),
      (r || i) &&
        (0, t.jsx)("p", {
          className:
            "text-[13.5px] leading-relaxed text-muted-foreground animate-[ui-fade-up_320ms_cubic-bezier(0.23,1,0.32,1)_200ms_both] motion-reduce:animate-none",
          children: i
            ? "Going with all four channels."
            : o
              ? `Drafting for ${l}.`
              : `Planning for ${l}.`,
        }),
    ],
  });
});
