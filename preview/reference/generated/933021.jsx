"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/number-roll";
import * as dependency3 from "../../../registry/components/text-morph";
import * as dependency5 from "../../../registry/components/wheel-picker";
import * as dependency6 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
var a = dependency2;
var n = dependency3;
function m(props) {
  return dependency1.createElement(dependency5.WheelPicker, props);
}
function p(props) {
  return dependency1.createElement(dependency5.Wheel, props);
}
var h = dependency6;
let f = Array.from({ length: 12 }, (e, t) => t + 1);
let g = Array.from({ length: 60 }, (e, t) => ({
  value: t,
  label: String(t).padStart(2, "0"),
}));
let x = (e) => Array.from({ length: e }, (e, t) => t);
let v = [
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
let b = Array.from({ length: 16 }, (e, t) => 2020 + t);
function M() {
  let [e, n] = r.default.useState(7),
    [l, i] = r.default.useState(15),
    [s, u] = r.default.useState("AM"),
    o = (((e % 12) + 12 * ("PM" === s)) * 60 + l - 1361 + 1440) % 1440 || 1440;
  return (0, t.jsxs)(t.Fragment, {
    children: [
      (0, t.jsxs)("div", {
        className: "flex items-baseline justify-between gap-3",
        children: [
          (0, t.jsx)("p", {
            className: "text-[14px] font-medium tracking-[-0.01em]",
            children: "Wake up",
          }),
          (0, t.jsxs)("p", {
            className:
              "whitespace-nowrap text-[12px] tabular-nums text-muted-foreground",
            children: [
              "Rings in ",
              (0, t.jsx)(a.NumberRoll, {
                value: Math.floor(o / 60),
                className: "text-foreground",
              }),
              " h ",
              (0, t.jsx)(a.NumberRoll, {
                value: o % 60,
                className: "text-foreground",
              }),
              " min",
            ],
          }),
        ],
      }),
      (0, t.jsxs)(m, {
        className: "mt-3",
        "aria-label": "Alarm time",
        children: [
          (0, t.jsx)(p, {
            label: "Hour",
            options: f,
            value: e,
            onValueChange: n,
            loop: !0,
            align: "end",
            style: { flex: "0 0 74px" },
          }),
          (0, t.jsx)(p, {
            label: "Minute",
            options: g,
            value: l,
            onValueChange: i,
            loop: !0,
            style: { flex: "0 0 64px" },
          }),
          (0, t.jsx)(p, {
            label: "AM or PM",
            options: ["AM", "PM"],
            value: s,
            onValueChange: u,
            align: "start",
            style: { flex: "0 0 74px" },
          }),
        ],
      }),
    ],
  });
}
function y() {
  let [e, a] = r.default.useState(0),
    [l, i] = r.default.useState(25),
    [s, u] = r.default.useState(0),
    o = 3600 * e + 60 * l + s,
    c = (81660 + o) % 86400,
    d = `${((Math.floor(c / 3600) + 11) % 12) + 1}:${String(Math.floor(c / 60) % 60).padStart(2, "0")} ${c >= 43200 ? "pm" : "am"}`;
  return (0, t.jsxs)(t.Fragment, {
    children: [
      (0, t.jsxs)("div", {
        className: "flex items-baseline justify-between gap-3",
        children: [
          (0, t.jsx)("p", {
            className: "text-[14px] font-medium tracking-[-0.01em]",
            children: "Focus timer",
          }),
          (0, t.jsx)("p", {
            className: "whitespace-nowrap text-[12px] text-muted-foreground",
            children: (0, t.jsx)(n.TextMorph, {
              children: o ? `Ends at ${d}` : "Set a length",
            }),
          }),
        ],
      }),
      (0, t.jsxs)(m, {
        className: "mt-3",
        "aria-label": "Timer length",
        children: [
          (0, t.jsx)(p, {
            label: "Hours",
            options: x(24),
            value: e,
            onValueChange: a,
            align: "end",
            unit: (e) => (1 === e ? "hour" : "hours"),
          }),
          (0, t.jsx)(p, {
            label: "Minutes",
            options: x(60),
            value: l,
            onValueChange: i,
            loop: !0,
            align: "end",
            unit: "min",
          }),
          (0, t.jsx)(p, {
            label: "Seconds",
            options: x(60),
            value: s,
            onValueChange: u,
            loop: !0,
            align: "end",
            unit: "sec",
          }),
        ],
      }),
    ],
  });
}
function j() {
  let [e, a] = r.default.useState(9),
    [l, i] = r.default.useState(14),
    [s, u] = r.default.useState(2026),
    o = new Date(s, e + 1, 0).getDate();
  r.default.useEffect(() => {
    l > o && i(o);
  }, [l, o]);
  let c = r.default.useMemo(
      () =>
        Array.from({ length: 31 }, (e, t) => ({
          value: t + 1,
          disabled: t + 1 > o,
        })),
      [o],
    ),
    d = new Date(s, e, Math.min(l, o)).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  return (0, t.jsxs)(t.Fragment, {
    children: [
      (0, t.jsxs)("div", {
        className: "flex items-baseline justify-between gap-3",
        children: [
          (0, t.jsx)("p", {
            className: "text-[14px] font-medium tracking-[-0.01em]",
            children: "Launch date",
          }),
          (0, t.jsx)("p", {
            className: "whitespace-nowrap text-[12px] text-muted-foreground",
            children: (0, t.jsx)(n.TextMorph, {
              children: d.replace(/^(\w+) /, "$1, "),
            }),
          }),
        ],
      }),
      (0, t.jsxs)(m, {
        className: "mt-3",
        "aria-label": "Launch date",
        children: [
          (0, t.jsx)(p, {
            label: "Month",
            options: v.map((e, t) => ({ value: t, label: e })),
            value: e,
            onValueChange: a,
            loop: !0,
            align: "start",
            style: { flexGrow: 1.7 },
          }),
          (0, t.jsx)(p, {
            label: "Day",
            options: c,
            value: Math.min(l, o),
            onValueChange: i,
            loop: !0,
            align: "end",
            style: { flexGrow: 0.7 },
          }),
          (0, t.jsx)(p, {
            label: "Year",
            options: b,
            value: s,
            onValueChange: u,
            align: "end",
          }),
        ],
      }),
    ],
  });
}
export default (function ({ tab: e = "Alarm" }) {
  return (0, t.jsx)("div", {
    style: (0, h.demoAppearance)(),
    className: "w-full max-w-[380px] text-foreground",
    children: (0, t.jsx)("div", {
      className: "rounded-[22px] border border-border bg-background p-4 sm:p-5",
      children:
        "Timer" === e
          ? (0, t.jsx)(y, {})
          : "Date" === e
            ? (0, t.jsx)(j, {})
            : (0, t.jsx)(M, {}),
    }),
  });
});
