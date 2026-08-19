"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency5 from "../../../registry/components/steps";
import * as dependency6 from "../../../registry/components/button";
("use strict");
var t = dependency0;
var r = dependency1;
function o(props) {
  return dependency1.createElement(dependency5.Steps, props);
}
var l = dependency6;
let c = [
  { label: "Cart", description: "3 flavours" },
  { label: "Details", description: "Where it goes" },
  { label: "Payment", description: "Card or Apple Pay" },
  { label: "Done", description: "Ships Monday" },
];
export default (function ({ tab: e = "Horizontal" }) {
  let [n, i] = r.useState(1);
  return (0, t.jsxs)("div", {
    className: "flex w-full max-w-[460px] flex-col items-center gap-6",
    children: [
      (0, t.jsx)(o, {
        steps: c,
        current: n,
        orientation: "Vertical" === e ? "vertical" : "horizontal",
        onStepClick: i,
      }),
      (0, t.jsxs)("div", {
        className: "flex gap-2",
        children: [
          (0, t.jsx)(l.Button, {
            variant: "ghost",
            size: "sm",
            disabled: 0 === n,
            onClick: () => i((e) => e - 1),
            children: "Back",
          }),
          (0, t.jsx)(l.Button, {
            size: "sm",
            disabled: n >= c.length,
            onClick: () => i((e) => e + 1),
            children: n >= c.length - 1 ? "Finish" : "Continue",
          }),
        ],
      }),
    ],
  });
});
