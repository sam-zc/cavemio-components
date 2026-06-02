"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency3 from "../../../registry/components/skeleton";
import * as dependency4 from "../../../registry/components/button";
("use strict");
var t = dependency0;
var r = dependency1;
function n(props) {
  return dependency1.createElement(dependency3.Skeleton, props);
}
function s(props) {
  return dependency1.createElement(dependency3.SkeletonSwap, props);
}
var a = dependency4;
export default (function ({ tab: e = "Card" }) {
  let [i, o] = r.useState(!0);
  return (r.useEffect(() => {
    if (!i) return;
    let e = window.setTimeout(() => o(!1), 1800);
    return () => window.clearTimeout(e);
  }, [i]),
  "List" === e)
    ? (0, t.jsx)("div", {
        className: "flex w-full max-w-[320px] flex-col gap-3",
        children: [0, 1, 2].map((e) =>
          (0, t.jsxs)(
            "div",
            {
              className: "flex items-center gap-3",
              children: [
                (0, t.jsx)(n, { shape: "circle", width: 32 }),
                (0, t.jsxs)("div", {
                  className: "flex flex-1 flex-col gap-2",
                  children: [
                    (0, t.jsx)(n, { width: `${70 - 12 * e}%` }),
                    (0, t.jsx)(n, { width: "40%", height: 10 }),
                  ],
                }),
              ],
            },
            e,
          ),
        ),
      })
    : (0, t.jsxs)("div", {
        className: "flex w-full max-w-[320px] flex-col items-center gap-4",
        children: [
          (0, t.jsx)("div", {
            className:
              "w-full rounded-[16px] bg-card p-4 shadow-[inset_0_0_0_1px_var(--border)]",
            children: (0, t.jsx)(s, {
              loading: i,
              label: "Loading revenue",
              fallback: (0, t.jsxs)("div", {
                className: "flex flex-col gap-3",
                children: [
                  (0, t.jsx)(n, { width: "35%" }),
                  (0, t.jsx)(n, { width: "55%", height: 28 }),
                  (0, t.jsx)(n, { shape: "block", height: 64 }),
                ],
              }),
              children: (0, t.jsxs)("div", {
                className: "flex flex-col gap-1",
                children: [
                  (0, t.jsx)("span", {
                    className: "text-[12.5px] text-muted-foreground",
                    children: "Revenue this month",
                  }),
                  (0, t.jsx)("span", {
                    className:
                      "text-[28px] font-semibold tracking-[-0.03em] text-foreground",
                    children: "£48,210",
                  }),
                  (0, t.jsx)("span", {
                    className:
                      "text-[12.5px] text-emerald-600 dark:text-emerald-400",
                    children: "+12% on September",
                  }),
                  (0, t.jsx)("p", {
                    className:
                      "pt-2 text-[13px] leading-relaxed text-muted-foreground",
                    children:
                      "Pistachio outsold everything for the third week, and Brick Lane had its best Saturday.",
                  }),
                ],
              }),
            }),
          }),
          (0, t.jsx)(a.Button, {
            variant: "outline",
            size: "sm",
            onClick: () => o(!0),
            children: "Load again",
          }),
        ],
      });
});
