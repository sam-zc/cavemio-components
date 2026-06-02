"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/slider";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency2;
export default (function ({ tab: e = "Single" }) {
  let [a, l] = r.useState([40, 120]);
  return "Range" === e
    ? (0, t.jsxs)("div", {
        className: "flex w-full max-w-[320px] flex-col gap-3",
        children: [
          (0, t.jsx)(n.Slider, {
            label: "Price",
            min: 0,
            max: 200,
            step: 5,
            value: a,
            onValueChange: l,
            format: (e) => `$${e}`,
          }),
          (0, t.jsxs)("p", {
            className:
              "text-center text-[12.5px] tabular-nums text-muted-foreground",
            children: ["$", a[0], " to $", a[1]],
          }),
        ],
      })
    : (0, t.jsx)("div", {
        className: "w-full max-w-[320px]",
        children: (0, t.jsx)(n.Slider, {
          label: "Volume",
          defaultValue: 60,
          format: (e) => `${e}%`,
        }),
      });
});
