"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/steps-chart";
("use strict");
var t = dependency0;
function x(props) {
  return dependency1.createElement(dependency4.StepsChart, props);
}
let m = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
let p = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
let h = (e, t, a, l, r = -1) => ({
  id: e,
  label: t,
  days: m.map((e, t) => {
    let n;
    return {
      key: e,
      label: p[t],
      value: l[t] ?? 0,
      title:
        ((n = new Date(`${a}T12:00:00`)).setDate(n.getDate() + t),
        n.toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })),
      today: t === r || void 0,
    };
  }),
});
let g = [
  h(
    "w38",
    "14 to 20 Sept",
    "2026-09-14",
    [7820, 11240, 9310, 12680, 10950, 14210, 6430],
  ),
  h(
    "w39",
    "21 to 27 Sept",
    "2026-09-21",
    [9120, 8440, 10870, 7960, 12330, 15820, 8910],
  ),
  h(
    "w40",
    "Last week",
    "2026-09-28",
    [10480, 12110, 6920, 11760, 9840, 13590, 10220],
  ),
  h("w41", "This week", "2026-10-05", [11320, 8760, 12940, 9870, 6180], 4),
];
export default (function () {
  return (0, t.jsx)("div", {
    className: "w-full max-w-[520px] py-4",
    children: (0, t.jsx)(x, { weeks: g, goal: 1e4, locales: "en-US" }),
  });
});
