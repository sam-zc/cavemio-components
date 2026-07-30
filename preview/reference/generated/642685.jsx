"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/imported-ui-interaction-motion";
import * as dependency5 from "../../../registry/components/morphing-chart";
import * as dependency6 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
var l = dependency4;
function j(props) {
  return dependency1.createElement(dependency5.MorphingChart, props);
}
var R = dependency6;
let O = [
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
let L = [
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
].map((e) => `${e} 2025`);
let T = [
  6100, 5800, 7400, 9200, 11800, 14900, 17600, 16900, 12100, 9400, 7300, 8900,
];
let k = { style: "currency", currency: "USD", maximumFractionDigits: 0 };
let S = Array.from({ length: 12 }, (e, t) => 11 + t);
let N = S.map((e) => `${((e + 11) % 12) + 1}${e < 12 ? "am" : "pm"}`);
let E = S.map((e) => `${e}:00 to ${e + 1}:00`);
let C = [14, 31, 46, 38, 27, 24, 33, 51, 64, 58, 41, 9];
let F = Array.from({ length: 30 }, (e, t) => new Date(2026, 8, 12 + t, 12));
let I = F.map((e) =>
  e.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
);
let D = F.map((e) =>
  e.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }),
);
let P = F.map((e, t) =>
  Math.round(
    (1150 +
      9 * t +
      520 * !![0, 6].includes(e.getDay()) +
      (t >= 21 ? 640 - (t - 21) * 38 : 0)) *
      (1 + 0.06 * Math.sin(2.3 * t)),
  ),
);
function _() {
  let { ref: e, active: a } = (0, l.useInteractionActivity)(),
    [n, o] = r.default.useState(C);
  return (
    r.default.useEffect(() => {
      if (!a) return;
      let e = 0,
        t = () => {
          e = window.setTimeout(
            () => {
              (o((e) =>
                e[e.length - 1] >= 44
                  ? e
                  : [
                      ...e.slice(0, -1),
                      e[e.length - 1] + 1 + Math.floor(3 * Math.random()),
                    ],
              ),
                t());
            },
            1100 + 900 * Math.random(),
          );
        };
      return (t(), () => window.clearTimeout(e));
    }, [a]),
    (0, t.jsx)("div", {
      ref: e,
      children: (0, t.jsx)(j, {
        title: "Orders today",
        caption: "Kept, Saturday 10 October",
        labels: N,
        titles: E,
        values: n,
        defaultShape: "line",
        locales: "en-GB",
      }),
    })
  );
}
export default (function ({ tab: e = "Revenue" }) {
  return (0, t.jsx)("div", {
    style: (0, R.demoAppearance)(),
    className: "w-full max-w-[640px] py-4 text-foreground",
    children:
      "Today" === e
        ? (0, t.jsx)(_, {})
        : "Visitors" === e
          ? (0, t.jsx)(j, {
              title: "Visitors",
              caption: "kept.shop, last 30 days",
              labels: I,
              titles: D,
              values: P,
              defaultShape: "area",
              locales: "en-GB",
            })
          : (0, t.jsx)(j, {
              title: "Revenue",
              caption: "January to December 2025",
              labels: O,
              titles: L,
              values: T,
              format: k,
              locales: "en-US",
            }),
  });
});
