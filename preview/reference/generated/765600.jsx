"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency3 from "../../../registry/components/stage-bars";
("use strict");
var t = dependency0;
function l(props) {
  return dependency1.createElement(dependency3.StageBars, props);
}
let d = [
  { id: "opened", label: "Opened the app" },
  { id: "browsed", label: "Browsed the flavours" },
  { id: "basket", label: "Added to basket" },
  { id: "checkout", label: "Started checkout" },
  { id: "paid", label: "Paid" },
];
let o = [
  { id: "week", label: "This week", values: [2480, 1910, 1164, 742, 611] },
  { id: "last", label: "Last week", values: [2310, 1655, 921, 548, 437] },
  { id: "month", label: "30 days", values: [9860, 7240, 4215, 2690, 2174] },
];
export default (function () {
  return (0, t.jsx)("div", {
    className: "w-full max-w-[560px] py-4",
    children: (0, t.jsx)(l, {
      title: "App orders",
      stages: d,
      periods: o,
      locales: "en-US",
    }),
  });
});
