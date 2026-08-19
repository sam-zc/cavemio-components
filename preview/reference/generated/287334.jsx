"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/stepper-input";
import * as dependency3 from "../../../registry/components/number-roll";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency2;
var a = dependency3;
export default (function ({ tab: e = "Seat count" }) {
  let [s, o] = r.useState(6),
    [l, i] = r.useState(12),
    [d, u] = r.useState(0.7);
  return (0, t.jsxs)("div", {
    className: "flex w-full max-w-md flex-col items-center justify-center p-4",
    children: [
      "Seat count" === e &&
        (0, t.jsxs)("div", {
          className:
            "w-full rounded-2xl border border-border bg-card p-5 text-card-foreground",
          children: [
            (0, t.jsxs)("div", {
              className:
                "flex items-center justify-between border-b border-border pb-4",
              children: [
                (0, t.jsxs)("div", {
                  children: [
                    (0, t.jsx)("p", {
                      className: "text-[13.5px] font-medium text-foreground",
                      children: "Team members",
                    }),
                    (0, t.jsx)("p", {
                      className: "text-[12px] text-muted-foreground",
                      children: "$18 / user billed monthly",
                    }),
                  ],
                }),
                (0, t.jsx)("span", {
                  className:
                    "rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary",
                  children: "Pro plan",
                }),
              ],
            }),
            (0, t.jsxs)("div", {
              className: "mt-5 flex items-center justify-between gap-4",
              children: [
                (0, t.jsx)("span", {
                  className: "text-[13px] text-muted-foreground",
                  children: "Active seats",
                }),
                (0, t.jsx)(n.StepperInput, {
                  label: "Seats",
                  value: s,
                  min: 1,
                  max: 40,
                  unit: "seats",
                  onValueChange: o,
                }),
              ],
            }),
            (0, t.jsxs)("div", {
              className:
                "mt-6 flex items-baseline justify-between rounded-xl bg-muted/50 px-4 py-3 border border-border/50",
              children: [
                (0, t.jsx)("span", {
                  className: "text-[12.5px] text-muted-foreground",
                  children: "Monthly total",
                }),
                (0, t.jsxs)("div", {
                  className:
                    "flex items-baseline gap-1 font-mono text-[16px] font-semibold text-foreground",
                  children: [
                    (0, t.jsx)(a.NumberRoll, {
                      value: 18 * s,
                      prefix: "$",
                      duration: 260,
                    }),
                    (0, t.jsx)("span", {
                      className:
                        "font-sans text-[11px] font-normal text-muted-foreground",
                      children: "/mo",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      "Radius scale" === e &&
        (0, t.jsxs)("div", {
          className:
            "w-full rounded-2xl border border-border bg-card p-5 text-card-foreground",
          children: [
            (0, t.jsxs)("div", {
              className: "flex items-center justify-between pb-3",
              children: [
                (0, t.jsxs)("div", {
                  children: [
                    (0, t.jsx)("p", {
                      className: "text-[13.5px] font-medium text-foreground",
                      children: "Corner radius",
                    }),
                    (0, t.jsx)("p", {
                      className: "text-[12px] text-muted-foreground",
                      children: "Nudge or hold to scale shape",
                    }),
                  ],
                }),
                (0, t.jsx)(n.StepperInput, {
                  label: "Corner radius",
                  value: l,
                  min: 0,
                  max: 32,
                  step: 2,
                  unit: "px",
                  size: "sm",
                  onValueChange: i,
                }),
              ],
            }),
            (0, t.jsx)("div", {
              className:
                "mt-5 flex h-28 items-center justify-center rounded-xl bg-muted/40 border border-border/60",
              children: (0, t.jsx)("div", {
                className:
                  "flex size-16 items-center justify-center border border-primary/40 bg-primary/10 transition-[border-radius] duration-200",
                style: { borderRadius: `${l}px` },
                children: (0, t.jsxs)("span", {
                  className: "font-mono text-[11px] font-medium text-primary",
                  children: [l, "px"],
                }),
              }),
            }),
          ],
        }),
      "Bounded limit" === e &&
        (0, t.jsxs)("div", {
          className:
            "w-full rounded-2xl border border-border bg-card p-5 text-card-foreground",
          children: [
            (0, t.jsx)("div", {
              className: "flex items-center justify-between pb-3",
              children: (0, t.jsxs)("div", {
                children: [
                  (0, t.jsx)("p", {
                    className: "text-[13.5px] font-medium text-foreground",
                    children: "Sampling temperature",
                  }),
                  (0, t.jsx)("p", {
                    className: "text-[12px] text-muted-foreground",
                    children: "Bound strictly between 0.0 and 1.0",
                  }),
                ],
              }),
            }),
            (0, t.jsxs)("div", {
              className:
                "mt-3 flex items-center justify-between rounded-xl border border-border/70 p-3",
              children: [
                (0, t.jsx)("span", {
                  className: "text-[13px] text-muted-foreground",
                  children: "Creativity",
                }),
                (0, t.jsx)(n.StepperInput, {
                  label: "Temperature",
                  value: d,
                  min: 0,
                  max: 1,
                  step: 0.1,
                  onValueChange: u,
                }),
              ],
            }),
            (0, t.jsx)("p", {
              className:
                "mt-3 text-[11.5px] text-muted-foreground leading-relaxed",
              children:
                "Hit 0.0 or 1.0 to see the elastic bumper shake when hitting the threshold limits.",
            }),
          ],
        }),
    ],
  });
});
