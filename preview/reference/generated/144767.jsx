"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/revenue-chart";
("use strict");
var t = dependency0;
function m(props) {
  return dependency1.createElement(dependency4.RevenueChart, props);
}
let p = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let x = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let f = [
  6100, 5800, 7400, 9200, 11800, 14900, 17600, 16900, 12100, 9400, 7300, 8900,
];
let g = [6900, 6600, 8700, 10400, 13900, 17800, 20600, 19800, 13900, 10700];
let y = [8.6, 8.5, 8.8, 9, 9.1, 9.3, 9.4, 9.4, 9.2, 9, 8.9, 9.6];
let b = [9.1, 9, 9.3, 9.5, 9.7, 9.9, 10.1, 10, 9.8, 9.6];
let v = (e, t) => e.map((e, r) => Math.round(e / t[r]));
let j = [
  {
    id: "revenue",
    label: "Revenue",
    current: g,
    previous: f,
    format: { style: "currency", currency: "USD", maximumFractionDigits: 0 },
  },
  { id: "orders", label: "Orders", current: v(g, b), previous: v(f, y) },
  {
    id: "average",
    label: "Average order",
    current: b,
    previous: y,
    format: {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    total: "average",
  },
];
export default (function () {
  return (0, t.jsx)("div", {
    className: "w-full max-w-[680px] py-4",
    children: (0, t.jsx)(m, {
      labels: p,
      titles: x,
      metrics: j,
      series: ["2026", "2025"],
      locales: "en-US",
    }),
  });
});
