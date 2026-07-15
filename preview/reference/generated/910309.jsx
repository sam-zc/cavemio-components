"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/earnings-chart";
("use strict");
var t = dependency0;
function p(props) {
  return dependency1.createElement(dependency4.EarningsChart, props);
}
let h = {
  Nov: "November",
  Dec: "December",
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
};
let x = [
  ["2025-11", "Nov", 3120],
  ["2025-12", "Dec", 2480],
  ["2026-01", "Jan", 2210],
  ["2026-02", "Feb", 2640],
  ["2026-03", "Mar", 3890],
  ["2026-04", "Apr", 5120],
  ["2026-05", "May", 6980],
  ["2026-06", "Jun", 9340],
  ["2026-07", "Jul", 11860],
  ["2026-08", "Aug", 11210],
  ["2026-09", "Sep", 7460],
  ["2026-10", "Oct", 5380],
].map(([e, t, r]) => ({
  key: e,
  label: t,
  value: r,
  title: `${h[t]} ${e.slice(0, 4)}`,
}));
let f = [
  {
    id: "6m",
    label: "6M",
    bars: x.slice(6),
    previous: 46120,
    comparison: "vs May to Oct last year",
  },
  {
    id: "1y",
    label: "1Y",
    bars: x,
    previous: 61940,
    comparison: "vs the year before",
  },
  {
    id: "all",
    label: "All",
    bars: [
      { key: "y2022", label: "2022", value: 31200 },
      { key: "y2023", label: "2023", value: 44850 },
      { key: "y2024", label: "2024", value: 52300 },
      { key: "y2025", label: "2025", value: 61940 },
      { key: "y2026", label: "2026", value: 66090, title: "2026 so far" },
    ],
    comparison: "since the shop opened",
  },
];
export default (function () {
  return (0, t.jsx)("div", {
    className: "w-full max-w-[600px] py-4",
    children: (0, t.jsx)(p, {
      title: "Earned so far",
      periods: f,
      defaultValue: "1y",
      locales: "en-US",
    }),
  });
});
