"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency7 from "../../../registry/components/date-picker";
("use strict");
var t = dependency0;
var r = dependency1;
function b(props) {
  return dependency1.createElement(dependency7.DatePicker, props);
}
export default (function ({ tab: e = "Due date" }) {
  let [n, o] = r.useState(null);
  return "Limits" === e
    ? (0, t.jsx)("div", {
        className: "w-full max-w-[300px]",
        children: (0, t.jsx)(b, {
          label: "Delivery day",
          min: "2026-10-21",
          max: "2026-12-20",
          hint: "21 October to 20 December.",
        }),
      })
    : (0, t.jsxs)("div", {
        className: "flex w-full max-w-[300px] flex-col gap-3",
        children: [
          (0, t.jsx)(b, {
            label: "Due",
            value: n,
            onValueChange: o,
            hint: "Try “next fri”, “in 3 days” or “4 nov”.",
          }),
          (0, t.jsxs)("p", {
            className: "px-3 font-mono text-[11.5px] text-muted-foreground",
            children: ["value: ", n ? `"${n}"` : "null"],
          }),
        ],
      });
});
