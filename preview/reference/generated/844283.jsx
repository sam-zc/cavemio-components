"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../icon-factory";
import * as dependency3 from "../../../registry/components/number-roll";
import * as dependency5 from "../../../registry/components/ratio-balancer";
import * as dependency6 from "../../../registry/components/text-morph";
import * as dependency7 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
let a = (0, dependency2.default)("ChartPie", [
  [
    "path",
    {
      d: "M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z",
      key: "pzmjnu",
    },
  ],
  ["path", { d: "M21.21 15.89A10 10 0 1 1 8 2.83", key: "k2fpak" }],
]);
var n = dependency3;
function d(props) {
  return dependency1.createElement(dependency5.RatioBalancer, props);
}
var u = dependency6;
var c = dependency7;
export default (function ({ tab: e = "compute" }) {
  let i = "budget" === e,
    o = "traffic" === e,
    l = r.useMemo(
      () =>
        i
          ? [
              { id: "eng", label: "Engineering", ratio: 45 },
              { id: "mktg", label: "Growth", ratio: 35 },
              { id: "ops", label: "Operations", ratio: 20 },
            ]
          : o
            ? [
                { id: "us", label: "US-East (VA)", ratio: 50 },
                { id: "eu", label: "EU-West (IE)", ratio: 30 },
                { id: "ap", label: "AP-South (SG)", ratio: 20 },
              ]
            : [
                { id: "inference", label: "Inference", ratio: 55 },
                { id: "tuning", label: "Fine-tuning", ratio: 25 },
                { id: "embed", label: "Embeddings", ratio: 20 },
              ],
      [i, o],
    ),
    [s, m] = r.useState(l);
  r.useEffect(() => {
    m(l);
  }, [l]);
  let f = s[0] ?? { label: "", ratio: 0 },
    x = i
      ? `${f.label} holds ${f.ratio}% allocation`
      : o
        ? `Routing ${f.ratio}% through ${f.label}`
        : `${f.ratio}% compute dedicated to ${f.label}`;
  return (0, t.jsxs)("div", {
    style: (0, c.demoAppearance)(),
    className: "w-full max-w-[480px] py-4 text-foreground",
    children: [
      (0, t.jsxs)("div", {
        className: "mb-4 flex items-center justify-between",
        children: [
          (0, t.jsx)("span", {
            className:
              "text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground",
            children: i
              ? "CAPITAL / OPEX BUDGET"
              : o
                ? "DNS / TRAFFIC ROUTING"
                : "CLUSTER / QUOTA WEIGHT",
          }),
          (0, t.jsx)(a, {
            "aria-hidden": "true",
            className: "size-4 text-primary",
          }),
        ],
      }),
      (0, t.jsx)("h3", {
        className: "mb-6 text-[22px] font-medium tracking-[-0.03em]",
        children: (0, t.jsx)(u.TextMorph, { children: x }),
      }),
      (0, t.jsx)("div", {
        className: "mb-6 grid grid-cols-3 gap-2",
        children: s.map((e) =>
          (0, t.jsxs)(
            "div",
            {
              className:
                "rounded-xl border border-border bg-surface px-3 py-2.5",
              children: [
                (0, t.jsx)("span", {
                  className: "truncate text-[10px] text-muted-foreground",
                  children: e.label,
                }),
                (0, t.jsx)("div", {
                  className: "mt-1 flex items-baseline gap-0.5",
                  children: (0, t.jsx)("span", {
                    className:
                      "font-mono text-[16px] font-medium tabular-nums text-foreground",
                    children: (0, t.jsx)(n.NumberRoll, {
                      value: e.ratio,
                      suffix: "%",
                      duration: 380,
                    }),
                  }),
                }),
              ],
            },
            e.id,
          ),
        ),
      }),
      (0, t.jsx)(d, {
        label: i
          ? "Operating expenditure"
          : o
            ? "Traffic weight"
            : "Hardware cluster reservation",
        segments: s,
        onValueCommit: (e) => {
          m((t) => t.map((t, r) => ({ ...t, ratio: e[r] ?? t.ratio })));
        },
      }),
      (0, t.jsx)("div", {
        className: "mt-6 flex justify-center gap-1.5",
        children: [
          { label: "Equal (33 / 33 / 34)", ratios: [33, 33, 34] },
          { label: "Priority (60 / 25 / 15)", ratios: [60, 25, 15] },
          { label: "Heavy primary (70 / 15 / 15)", ratios: [70, 15, 15] },
        ].map((e) =>
          (0, t.jsx)(
            "button",
            {
              type: "button",
              onClick: () => {
                m((t) =>
                  t.map((t, r) => ({ ...t, ratio: e.ratios[r] ?? t.ratio })),
                );
              },
              className:
                "cursor-pointer rounded-full border border-border px-3 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-border/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              children: e.label,
            },
            e.label,
          ),
        ),
      }),
      (0, t.jsx)("p", {
        className: "mt-4 text-center text-[10px] text-muted-foreground",
        children:
          "Drag divider grips between columns to rebalance percentages.",
      }),
    ],
  });
});
