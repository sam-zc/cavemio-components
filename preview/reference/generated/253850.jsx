"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/donut-chart";
import * as dependency5 from "../../../registry/components/segmented-control";
("use strict");
var t = dependency0;
var r = dependency1;
function c(props) {
  return dependency1.createElement(dependency4.DonutChart, props);
}
var m = dependency5;
let x = {
  this: [
    { id: "pistachio", label: "Pistachio", value: 2840 },
    { id: "caramel", label: "Salted caramel", value: 2310 },
    { id: "strawberry", label: "Strawberry", value: 1620 },
    { id: "mint", label: "Mint chip", value: 1180 },
    { id: "lemon", label: "Lemon sorbet", value: 640 },
  ],
  last: [
    { id: "pistachio", label: "Pistachio", value: 1960 },
    { id: "caramel", label: "Salted caramel", value: 2480 },
    { id: "strawberry", label: "Strawberry", value: 1150 },
    { id: "mint", label: "Mint chip", value: 1420 },
    { id: "lemon", label: "Lemon sorbet", value: 1090 },
  ],
};
let p = [
  { id: "ingredients", label: "Ingredients", value: 4820 },
  { id: "staff", label: "Staff", value: 3960 },
  { id: "rent", label: "Rent", value: 2200 },
  { id: "packaging", label: "Packaging", value: 860 },
];
let h = { style: "currency", currency: "USD", maximumFractionDigits: 0 };
export default (function ({ tab: e = "Breakdown" }) {
  let [a, n] = r.default.useState("this");
  return "Budget" === e
    ? (0, t.jsx)("div", {
        className: "w-full max-w-[460px]",
        children: (0, t.jsx)(c, {
          variant: "gauge",
          data: p,
          max: 15e3,
          title: "October budget",
          description: "Spent so far, 23 days in",
          centerLabel: "Spent",
          format: h,
          locales: "en-US",
        }),
      })
    : (0, t.jsx)("div", {
        className: "w-full max-w-[520px]",
        children: (0, t.jsx)(c, {
          data: x[a],
          title: "Sales by flavour",
          description:
            "this" === a ? "5 to 11 October" : "28 September to 4 October",
          action: (0, t.jsx)(m.SegmentedControl, {
            label: "Week",
            size: "sm",
            value: a,
            onValueChange: n,
            options: [
              { value: "this", label: "This week" },
              { value: "last", label: "Last week" },
            ],
          }),
          format: h,
          locales: "en-US",
        }),
      });
});
