"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/activity-heatmap";
import * as dependency5 from "../../../registry/components/segmented-control";
("use strict");
var t = dependency0;
var r = dependency1;
function m(props) {
  return dependency1.createElement(dependency4.ActivityHeatmap, props);
}
var x = dependency5;
let f = Date.UTC(2026, 9, 9);
function h(e, t, r) {
  let a,
    n =
      ((a = e),
      () => (a = (1664525 * a + 0x3c6ef35f) % 0x100000000) / 0x100000000);
  return Array.from({ length: 182 }, (e, a) => {
    let l = new Date(f - (181 - a) * 864e5),
      o = l.getUTCMonth(),
      s = 7 === o && l.getUTCDate() >= 17 && 23 >= l.getUTCDate(),
      i = l.getUTCDay(),
      d = s
        ? 0
        : Math.max(
            0,
            Math.round(
              t *
                (o >= 5 && o <= 7 ? 1.7 : 8 === o ? 1.25 : 0.8) *
                (0 === i || 6 === i ? r : 1 === i ? 0.45 : 1) *
                (0.45 + 0.9 * n()) -
                (0.08 > n() ? t : 0),
            ),
          );
    return { date: l.toISOString().slice(0, 10), value: d };
  });
}
let p = {
  orders: {
    data: h(7, 9, 1.9),
    unit: { one: "order", other: "orders" },
    color: "var(--chart-3)",
  },
  customers: {
    data: h(23, 3, 2.4),
    unit: { one: "new customer", other: "new customers" },
    color: "var(--chart-1)",
  },
};
export default (function () {
  let [e, a] = r.default.useState("orders"),
    n = p[e];
  return (0, t.jsx)("div", {
    className: "w-full max-w-[640px]",
    children: (0, t.jsx)(m, {
      data: n.data,
      unit: n.unit,
      color: n.color,
      title: "Kept, Market Street",
      description: "Every day since April",
      action: (0, t.jsx)(x.SegmentedControl, {
        label: "Metric",
        size: "sm",
        value: e,
        onValueChange: (e) => a(e),
        options: [
          { value: "orders", label: "Orders" },
          { value: "customers", label: "New customers" },
        ],
      }),
      locales: "en-US",
    }),
  });
});
