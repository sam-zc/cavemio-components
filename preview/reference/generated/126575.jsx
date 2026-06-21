"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/area-chart";
("use strict");
var t = dependency0;
function m(props) {
  return dependency1.createElement(dependency4.AreaChart, props);
}
let h = Array.from({ length: 12 }, (e, t) => {
  let r = new Date("2026-07-20T12:00:00");
  return (r.setDate(r.getDate() + 7 * t), r);
});
let x = h.map((e) =>
  e.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
);
let f = h.map(
  (e) =>
    `Week of ${e.toLocaleDateString("en-GB", { day: "numeric", month: "long" })}`,
);
let g = [
  {
    id: "counter",
    label: "Counter",
    values: [842, 905, 931, 880, 864, 812, 760, 702, 655, 618, 590, 571],
  },
  {
    id: "app",
    label: "App",
    values: [212, 238, 266, 291, 318, 342, 371, 389, 402, 431, 455, 478],
  },
  {
    id: "delivery",
    label: "Delivery",
    values: [168, 181, 204, 199, 214, 232, 226, 241, 237, 252, 266, 259],
  },
];
export default (function () {
  return (0, t.jsx)("div", {
    className: "w-full max-w-[680px] py-4",
    children: (0, t.jsx)(m, {
      title: "Orders",
      caption: "in the last 12 weeks",
      labels: x,
      titles: f,
      series: g,
      locales: "en-US",
    }),
  });
});
