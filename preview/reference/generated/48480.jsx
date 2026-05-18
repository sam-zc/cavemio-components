"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "lucide-react";
import * as dependency2 from "react";
import * as dependency3 from "../../../registry/components/feature-tabs";
("use strict");
var t = dependency0;
var r = dependency1;
function o(props) {
  return dependency2.createElement(dependency3.FeatureTabs, props);
}
function d({ title: e, children: r }) {
  return (0, t.jsxs)("div", {
    className: "grid gap-5 sm:grid-cols-[1fr_1.15fr] sm:items-center",
    children: [
      (0, t.jsx)("div", {
        children: (0, t.jsx)("p", {
          className:
            "text-[18px] font-medium leading-snug tracking-[-0.02em] text-foreground",
          children: e,
        }),
      }),
      (0, t.jsx)("div", {
        className: "rounded-[18px] border border-border p-4",
        children: r,
      }),
    ],
  });
}
let u = [
  {
    id: "plan",
    label: "Plan",
    content: (0, t.jsx)(d, {
      title: "Turn a rough idea into a plan you can actually ship.",
      children: (0, t.jsx)("ul", {
        className: "space-y-2.5 text-[12.5px]",
        children: [
          "Draft the opening week",
          "Book the tasting",
          "Print the menu boards",
          "Schedule the launch post",
        ].map((e, n) =>
          (0, t.jsxs)(
            "li",
            {
              className: "flex items-center gap-2.5",
              children: [
                (0, t.jsx)("span", {
                  className: `flex size-4 items-center justify-center rounded-full ${n < 2 ? "bg-foreground text-background" : "shadow-[inset_0_0_0_1px_var(--border)]"}`,
                  children:
                    n < 2 &&
                    (0, t.jsx)(r.Check, {
                      className: "size-2.5",
                      strokeWidth: 3,
                    }),
                }),
                (0, t.jsx)("span", {
                  className:
                    n < 2
                      ? "text-muted-foreground line-through decoration-border"
                      : "text-foreground",
                  children: e,
                }),
              ],
            },
            e,
          ),
        ),
      }),
    }),
  },
  {
    id: "write",
    label: "Write",
    content: (0, t.jsx)(d, {
      title: "Write it once, in your voice, and keep it consistent everywhere.",
      children: (0, t.jsxs)("div", {
        className: "space-y-2",
        children: [
          (0, t.jsx)("div", { className: "h-2 w-3/4 rounded-full bg-muted" }),
          (0, t.jsx)("div", { className: "h-2 w-full rounded-full bg-muted" }),
          (0, t.jsx)("div", { className: "h-2 w-5/6 rounded-full bg-muted" }),
          (0, t.jsxs)("p", {
            className: "pt-2 text-[12.5px] leading-relaxed text-foreground",
            children: [
              "“Pistachio leads all weekend. ",
              (0, t.jsx)("span", {
                className: "rounded-[3px] bg-primary/15",
                children: "Churn it early Saturday",
              }),
              " so it sets before the rush.”",
            ],
          }),
        ],
      }),
    }),
  },
  {
    id: "ship",
    label: "Ship",
    content: (0, t.jsx)(d, {
      title: "Ship with a log you can read, and a rollback you can trust.",
      children: (0, t.jsxs)("div", {
        className: "space-y-1.5 font-mono text-[11.5px] text-muted-foreground",
        children: [
          (0, t.jsx)("p", { children: "✓ Built in 9.1s" }),
          (0, t.jsx)("p", { children: "✓ 50 tests passed" }),
          (0, t.jsx)("p", { children: "✓ Deployed to harbour-road.relay.app" }),
          (0, t.jsx)("p", {
            className: "text-foreground",
            children: "Live · 0 errors in the last hour",
          }),
          (0, t.jsx)("p", { children: "Rollback ready" }),
        ],
      }),
    }),
  },
  {
    id: "measure",
    label: "Measure",
    content: (0, t.jsx)(d, {
      title: "See what moved the numbers.",
      children: (0, t.jsx)("div", {
        className: "flex h-24 items-end gap-1.5",
        children: [30, 42, 38, 55, 61, 58, 76, 88].map((e, r) =>
          (0, t.jsx)(
            "span",
            {
              className: `flex-1 rounded-t-[4px] ${7 === r ? "bg-primary" : "bg-muted"}`,
              style: { height: `${e}%` },
            },
            r,
          ),
        ),
      }),
    }),
  },
];
export default (function ({ tab: e = "Autoplay" }) {
  return (0, t.jsx)("div", {
    className: "w-full max-w-[640px]",
    children: (0, t.jsx)(o, {
      tabs: u,
      autoplay: "Autoplay" === e ? 4200 : void 0,
    }),
  });
});
