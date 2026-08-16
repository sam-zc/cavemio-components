"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency3 from "../../../registry/components/stats-band";
("use strict");
var t = dependency0;
function l(props) {
  return dependency1.createElement(dependency3.StatsBand, props);
}
let o = [
  {
    value: 12480,
    label: "Teams shipping on Relay",
    format: { notation: "compact", maximumFractionDigits: 1 },
    suffix: "+",
  },
  {
    value: 99.98,
    label: "Uptime this year",
    format: { maximumFractionDigits: 2 },
    suffix: "%",
  },
  {
    value: 4.9,
    label: "Average review",
    format: { minimumFractionDigits: 1, maximumFractionDigits: 1 },
    suffix: " / 5",
  },
  { value: 38, label: "Minutes to first deploy", format: void 0, prefix: "<" },
];
export default (function () {
  return (0, t.jsx)("div", {
    className: "w-full max-w-[760px] rounded-[22px] border border-border",
    children: (0, t.jsx)(l, { stats: o }),
  });
});
