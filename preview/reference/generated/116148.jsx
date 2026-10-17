"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency5 from "../../../registry/components/pricing-calculator";
("use strict");
var t = dependency0;
function d(props) {
  return dependency1.createElement(dependency5.PricingCalculator, props);
}
let c = (e) =>
  e <= 2500
    ? 0
    : e <= 1e4
      ? 29 + (e - 2500) * 0.004
      : e <= 1e5
        ? 59 + (e - 1e4) * 0.0025
        : 284 + (e - 1e5) * 0.0015;
let m = (e) =>
  e <= 2500 ? "Free" : e <= 1e4 ? "Starter" : e <= 1e5 ? "Growth" : "Scale";
let f = [
  { value: 2500, label: "2.5K" },
  { value: 1e4, label: "10K" },
  { value: 1e5, label: "100K" },
  { value: 5e5, label: "500K" },
];
let x = { notation: "compact", maximumFractionDigits: 1 };
export default (function () {
  return (0, t.jsx)("div", {
    className:
      "w-full max-w-[560px] rounded-[22px] border border-border bg-background p-6 sm:p-8",
    children: (0, t.jsx)(d, {
      label: "Monthly active users",
      min: 1e3,
      max: 1e6,
      defaultValue: 25e3,
      scale: "log",
      unit: "monthly active users",
      valueFormat: x,
      price: c,
      plan: m,
      marks: f,
      contactFrom: 5e5,
      yearlyDiscount: 0.2,
      cta: {
        label: (e) => ("Free" === e ? "Start for free" : `Start with ${e}`),
      },
    }),
  });
});
