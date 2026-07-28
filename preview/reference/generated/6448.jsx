"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency3 from "../../../registry/components/mode-switcher";
("use strict");
var t = dependency0;
var a = dependency1;
var r = dependency2;
var i = dependency2;
var l = dependency2;
var s = dependency3;
let n = [
  {
    value: "fast",
    label: "Fast",
    icon: (0, t.jsx)(l.Zap, {}),
    description: "Quick answers for everyday questions.",
  },
  {
    value: "thinking",
    label: "Thinking",
    icon: (0, t.jsx)(r.Brain, {}),
    description: "Takes a moment to reason before answering.",
  },
  {
    value: "research",
    label: "Research",
    icon: (0, t.jsx)(i.Telescope, {}),
    description: "Reads dozens of sources and writes a report.",
    locked: !0,
  },
];
export default (function () {
  let [e, r] = (0, a.useState)(null);
  return (0, t.jsxs)("div", {
    className: "flex flex-col items-center gap-4",
    children: [
      (0, t.jsx)(s.ModeSwitcher, {
        modes: n,
        defaultValue: "fast",
        showDescription: !0,
        onLockedSelect: (e) => r(`${e.label} is on the Pro plan.`),
      }),
      (0, t.jsx)("p", {
        className: "h-4 text-[12px] text-muted-foreground",
        children:
          e &&
          (0, t.jsx)("span", {
            className: "animate-[ui-fade-in_250ms_ease-out_both]",
            children: e,
          }),
      }),
    ],
  });
});
