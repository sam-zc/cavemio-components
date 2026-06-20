"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/activity-rings";
("use strict");
var t = dependency0;
function m(props) {
  return dependency1.createElement(dependency4.ActivityRings, props);
}
let x = [
  { id: "orders", label: "Orders", goal: 120 },
  {
    id: "revenue",
    label: "Revenue",
    goal: 1200,
    format: { style: "currency", currency: "USD", maximumFractionDigits: 0 },
  },
  { id: "regulars", label: "Regulars back", goal: 15 },
];
let p = [
  [131, 1284, 17],
  [98, 912, 11],
  [142, 1466, 21],
  [87, 845, 9],
  [93, 940, 12],
];
let h = ["M", "T", "W", "T", "F", "S", "S"].map((e, t) => {
  let r = new Date("2026-10-05T12:00:00");
  return (
    r.setDate(r.getDate() + t),
    {
      key: r.toISOString().slice(0, 10),
      label: e,
      title: r.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
      values: p[t] ?? [null, null, null],
    }
  );
});
export default (function () {
  return (0, t.jsx)("div", {
    className: "w-full max-w-[400px] py-4",
    children: (0, t.jsx)(m, { goals: x, days: h, locales: "en-US" }),
  });
});
