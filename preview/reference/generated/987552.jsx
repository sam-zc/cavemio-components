"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency3 from "../../../registry/components/number-roll";
import * as dependency5 from "../../../registry/components/range-ruler";
import * as dependency6 from "../../../registry/components/text-morph";
import * as dependency7 from "./25369.jsx";
("use strict");
var r = dependency0;
var t = dependency1;
var a = dependency2;
var n = dependency3;
function s(props) {
  return dependency1.createElement(dependency5.RangeRuler, props);
}
var u = dependency6;
var o = dependency7;
export default (function ({ tab: e = "filter" }) {
  let l = "latency" === e,
    i = "budget" === e,
    c = l ? [15, 60] : i ? [200, 750] : [40, 180],
    [d, m] = t.useState(c);
  t.useEffect(() => {
    m(c);
  }, [e]);
  let [x, b] = d,
    h = Math.max(2, Math.round((b - x) * 1.35)),
    f = l
      ? b - x <= 20
        ? "Ultra-low latency envelope"
        : "Standard geographic cluster"
      : i
        ? b > 600
          ? "High concurrency capacity"
          : "Predictable baseline spend"
        : h > 120
          ? "Broad catalog selection"
          : "Refined product tier";
  return (0, r.jsxs)("div", {
    style: (0, o.demoAppearance)(),
    className: "w-full max-w-[480px] py-4 text-foreground",
    children: [
      (0, r.jsxs)("div", {
        className: "mb-4 flex items-center justify-between",
        children: [
          (0, r.jsx)("span", {
            className:
              "text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground",
            children: l
              ? "INFRASTRUCTURE / SLA"
              : i
                ? "CLOUD CAPACITY / COST"
                : "CATALOG / PRICING",
          }),
          (0, r.jsx)(a.SlidersHorizontal, {
            "aria-hidden": "true",
            className: "size-4 text-primary",
          }),
        ],
      }),
      (0, r.jsx)("h3", {
        className: "mb-6 text-[22px] font-medium tracking-[-0.03em]",
        children: (0, r.jsx)(u.TextMorph, { children: f }),
      }),
      (0, r.jsxs)("div", {
        className:
          "mb-6 flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3",
        children: [
          (0, r.jsxs)("div", {
            className: "flex flex-col",
            children: [
              (0, r.jsx)("span", {
                className: "text-[11px] text-muted-foreground",
                children: l
                  ? "Target SLA interval"
                  : i
                    ? "Monthly reservation"
                    : "Matching items",
              }),
              (0, r.jsx)("span", {
                className:
                  "text-[16px] font-medium tabular-nums text-foreground",
                children: l
                  ? (0, r.jsxs)(r.Fragment, {
                      children: [
                        (0, r.jsx)(n.NumberRoll, { value: x, duration: 380 }),
                        " – ",
                        (0, r.jsx)(n.NumberRoll, { value: b, duration: 380 }),
                        " ms",
                      ],
                    })
                  : i
                    ? (0, r.jsxs)(r.Fragment, {
                        children: [
                          "$",
                          (0, r.jsx)(n.NumberRoll, { value: x, duration: 380 }),
                          " – $",
                          (0, r.jsx)(n.NumberRoll, { value: b, duration: 380 }),
                        ],
                      })
                    : (0, r.jsxs)(r.Fragment, {
                        children: [
                          (0, r.jsx)(n.NumberRoll, { value: h, duration: 380 }),
                          " items",
                        ],
                      }),
              }),
            ],
          }),
          (0, r.jsx)("div", {
            className: "text-right",
            children: (0, r.jsx)("span", {
              className: "text-[10px] font-mono text-muted-foreground",
              children: l
                ? "UPTIME 99.98%"
                : i
                  ? "TIER 3 DEDICATED"
                  : "FREE SHIPPING",
            }),
          }),
        ],
      }),
      (0, r.jsx)(s, {
        label: l
          ? "Latency bounds (ms)"
          : i
            ? "Budget allotment ($)"
            : "Price bracket ($)",
        value: d,
        min: 0,
        max: l ? 100 : i ? 1e3 : 300,
        step: l ? 1 : i ? 25 : 5,
        unit: l ? "ms" : "$",
        onValueCommit: m,
      }),
      (0, r.jsx)("div", {
        className: "mt-6 flex justify-center gap-1.5",
        children: (l
          ? [
              { label: "Edge (< 25ms)", val: [5, 25] },
              { label: "Regional", val: [20, 60] },
              { label: "Global", val: [40, 95] },
            ]
          : i
            ? [
                { label: "Starter", val: [100, 300] },
                { label: "Growth", val: [350, 750] },
                { label: "Enterprise", val: [600, 950] },
              ]
            : [
                { label: "Under $50", val: [10, 50] },
                { label: "Mid-tier", val: [50, 150] },
                { label: "Premium", val: [120, 280] },
              ]
        ).map((e) =>
          (0, r.jsx)(
            "button",
            {
              type: "button",
              onClick: () => m(e.val),
              className:
                "cursor-pointer rounded-full border border-border px-3 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-border/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              children: e.label,
            },
            e.label,
          ),
        ),
      }),
      (0, r.jsx)("p", {
        className: "mt-4 text-center text-[10px] text-muted-foreground",
        children:
          "Drag needles across ticks. Needles push each other on contact.",
      }),
    ],
  });
});
