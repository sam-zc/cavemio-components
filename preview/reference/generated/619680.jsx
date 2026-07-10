"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency3 from "../../../registry/components/number-roll";
import * as dependency4 from "../../../registry/components/text-morph";
import * as dependency5 from "../../../registry/components/date-range-picker";
("use strict");
var t = dependency0;
var r = dependency1;
var i = dependency3;
var o = dependency4;
function j(props) {
  return dependency1.createElement(dependency5.DateRangePicker, props);
}
let $ = (e) => new Date(e.getFullYear(), e.getMonth(), e.getDate());
let N = (e, t) => new Date(e.getFullYear(), e.getMonth(), e.getDate() + t);
let M = (e) =>
  Math.round(($(e.end).getTime() - $(e.start).getTime()) / 864e5) + 1;
let D = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });
let k = (e) => {
  let t = Math.floor(e.getTime() / 864e5),
    r = Math.abs(43758.5453 * Math.sin(12.9898 * t)) % 1;
  return Math.round(
    (1150 + (t % 365) * 0.9 + 380 * r) *
      (0 === e.getDay() || 6 === e.getDay() ? 0.68 : 1),
  );
};
function T() {
  let e = (0, r.useMemo)(() => $(new Date()), []),
    [n, a] = (0, r.useState)({ start: N(e, -29), end: e }),
    l = M(n),
    {
      total: s,
      delta: d,
      bars: u,
    } = (0, r.useMemo)(() => {
      let e = Array.from({ length: l }, (e, t) => k(N(n.start, t))),
        t = Array.from({ length: l }, (e, t) => k(N(n.start, t - l))),
        r = e.reduce((e, t) => e + t, 0),
        a = t.reduce((e, t) => e + t, 0),
        s = l > 31 ? 7 : 1;
      return {
        total: r,
        delta: ((r - a) / a) * 100,
        bars: Array.from(
          { length: Math.ceil(l / s) },
          (t, r) =>
            e.slice(r * s, r * s + s).reduce((e, t) => e + t, 0) /
            Math.min(s, l - r * s),
        ),
      };
    }, [n, l]),
    c = Math.max(...u);
  return (0, t.jsxs)("div", {
    className: "w-full rounded-[20px] border border-border bg-card p-4",
    children: [
      (0, t.jsxs)("div", {
        className: "flex items-center justify-between gap-3",
        children: [
          (0, t.jsxs)("div", {
            className: "min-w-0",
            children: [
              (0, t.jsx)("p", {
                className: "text-[13px] font-medium text-foreground",
                children: "Visitors",
              }),
              (0, t.jsx)("p", {
                className: "text-[11.5px] text-muted-foreground",
                children: "kept.coffee",
              }),
            ],
          }),
          (0, t.jsx)(j, { value: n, onValueChange: a, max: e, align: "end" }),
        ],
      }),
      (0, t.jsx)("p", {
        className:
          "mt-5 text-[26px] font-semibold leading-none tracking-tight text-foreground tabular-nums",
        children: (0, t.jsx)(i.NumberRoll, { value: s }),
      }),
      (0, t.jsxs)("p", {
        className: "mt-2 text-[12px] text-muted-foreground",
        children: [
          (0, t.jsx)("span", {
            className:
              d >= 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400",
            children: (0, t.jsx)(i.NumberRoll, {
              value: d,
              format: {
                maximumFractionDigits: 1,
                minimumFractionDigits: 1,
                signDisplay: "always",
              },
              suffix: "%",
            }),
          }),
          " ",
          (0, t.jsx)(o.TextMorph, {
            children: `vs the ${1 === l ? "day" : `${l} days`} before`,
          }),
        ],
      }),
      (0, t.jsx)("div", {
        className:
          "mt-5 flex h-20 items-end justify-center gap-[3px] border-b border-border",
        "aria-hidden": "true",
        children: u.map((e, r) =>
          (0, t.jsx)(
            "span",
            {
              className: "max-w-6 flex-1 rounded-t-[3px] bg-[var(--chart-1)]",
              style: {
                height: `${(e / c) * 100}%`,
                transition: "height 520ms cubic-bezier(0.16,1,0.3,1)",
              },
            },
            r,
          ),
        ),
      }),
      (0, t.jsxs)("div", {
        className:
          "mt-1.5 flex justify-between text-[11px] text-muted-foreground tabular-nums",
        children: [
          (0, t.jsx)(o.TextMorph, { children: D.format(n.start) }),
          (0, t.jsx)(o.TextMorph, { children: D.format(n.end) }),
        ],
      }),
    ],
  });
}
let C = (e) => N(e, (5 - e.getDay() + 7) % 7);
let F = [
  { label: "This weekend", range: (e) => ({ start: C(e), end: N(C(e), 2) }) },
  {
    label: "Next weekend",
    range: (e) => ({ start: N(C(e), 7), end: N(C(e), 9) }),
  },
  { label: "A week", range: (e) => ({ start: N(C(e), 3), end: N(C(e), 10) }) },
];
function R() {
  let e = (0, r.useMemo)(() => $(new Date()), []),
    [n, a] = (0, r.useState)(() => F[1].range(e)),
    l = M(n) - 1;
  return (0, t.jsxs)("div", {
    className: "w-full rounded-[20px] border border-border bg-card p-4",
    children: [
      (0, t.jsxs)("div", {
        className: "flex items-baseline justify-between gap-3",
        children: [
          (0, t.jsx)("p", {
            className: "text-[13px] font-medium text-foreground",
            children: "Loft in Alfama, Lisbon",
          }),
          (0, t.jsxs)("p", {
            className:
              "shrink-0 text-[12px] text-muted-foreground tabular-nums",
            children: ["$", 180, " a night"],
          }),
        ],
      }),
      (0, t.jsx)(j, {
        className: "mt-3",
        value: n,
        onValueChange: a,
        min: e,
        unit: "nights",
        presets: F,
      }),
      (0, t.jsxs)("dl", {
        className: "mt-4 space-y-2 text-[12.5px]",
        children: [
          (0, t.jsxs)("div", {
            className: "flex justify-between text-muted-foreground",
            children: [
              (0, t.jsxs)("dt", {
                children: [
                  (0, t.jsx)(i.NumberRoll, { value: l }),
                  " ",
                  (0, t.jsx)(o.TextMorph, {
                    children: 1 === l ? "night" : "nights",
                  }),
                  " × $",
                  180,
                ],
              }),
              (0, t.jsx)("dd", {
                className: "tabular-nums",
                children: (0, t.jsx)(i.NumberRoll, {
                  value: 180 * l,
                  prefix: "$",
                }),
              }),
            ],
          }),
          (0, t.jsxs)("div", {
            className: "flex justify-between text-muted-foreground",
            children: [
              (0, t.jsx)("dt", { children: "Cleaning" }),
              (0, t.jsx)("dd", { className: "tabular-nums", children: "$40" }),
            ],
          }),
          (0, t.jsxs)("div", {
            className:
              "flex justify-between border-t border-border pt-2 font-medium text-foreground",
            children: [
              (0, t.jsx)("dt", { children: "Total" }),
              (0, t.jsx)("dd", {
                className: "tabular-nums",
                children: (0, t.jsx)(i.NumberRoll, {
                  value: 180 * l + 40,
                  prefix: "$",
                }),
              }),
            ],
          }),
        ],
      }),
      (0, t.jsx)("button", {
        type: "button",
        className:
          "cursor-pointer mt-4 h-9 w-full rounded-full bg-primary text-[13px] font-medium text-primary-foreground",
        children: "Reserve",
      }),
    ],
  });
}
export default (function ({ tab: e = "Analytics" }) {
  return (0, t.jsxs)("div", {
    className: "flex h-[500px] w-full max-w-[400px] flex-col sm:h-[450px]",
    children: [
      "Stay" === e ? (0, t.jsx)(R, {}) : (0, t.jsx)(T, {}),
      (0, t.jsx)("p", {
        className: "mt-3 text-center text-[12px] text-muted-foreground",
        children: "Tap the dates.",
      }),
    ],
  });
});
