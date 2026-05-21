"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/number-roll";
("use strict");
var e = dependency0;
var o = dependency1;
var n = dependency2;
let r =
  "cursor-pointer h-8 rounded-full border border-border px-3 font-mono text-[12px] tabular-nums text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-[0.96]";
let a = { style: "currency", currency: "USD", maximumFractionDigits: 0 };
let l = { notation: "compact", maximumFractionDigits: 1 };
export default (function ({ tab: t = "Try it" }) {
  let [c, s] = (0, o.useState)(
    "Live" === t ? 12480 : "Compact" === t ? 9400 : 1248,
  );
  return (
    (0, o.useEffect)(() => {
      if ("Live" !== t) return;
      let e = window.setInterval(
        () => s((t) => t + 1 + Math.floor(7 * Math.random())),
        1400,
      );
      return () => window.clearInterval(e);
    }, [t]),
    (0, e.jsxs)("div", {
      className: "flex flex-col items-center gap-6",
      children: [
        "Live" === t
          ? (0, e.jsxs)("div", {
              className: "text-center",
              children: [
                (0, e.jsx)(n.NumberRoll, {
                  value: c,
                  className:
                    "text-[64px] font-medium leading-[1.1] tracking-[-0.04em] text-foreground",
                }),
                (0, e.jsx)("p", {
                  className: "mt-1 text-[13px] text-muted-foreground",
                  children: "templates downloaded",
                }),
              ],
            })
          : (0, e.jsx)(n.NumberRoll, {
              value: c,
              format: "Compact" === t ? l : "Currency" === t ? a : void 0,
              className:
                "text-[64px] font-medium leading-[1.1] tracking-[-0.04em] text-foreground",
            }),
        "Live" !== t &&
          (0, e.jsxs)("div", {
            className: "flex flex-wrap justify-center gap-1.5",
            children: [
              (0, e.jsx)("button", {
                type: "button",
                className: r,
                onClick: () => s((t) => Math.max(0, t - 1)),
                children: "−1",
              }),
              (0, e.jsx)("button", {
                type: "button",
                className: r,
                onClick: () => s((t) => t + 1),
                children: "+1",
              }),
              (0, e.jsx)("button", {
                type: "button",
                className: r,
                onClick: () => s((t) => t + 752),
                children: "+752",
              }),
              (0, e.jsx)("button", {
                type: "button",
                className: r,
                onClick: () => s((t) => 10 * t),
                children: "×10",
              }),
              (0, e.jsx)("button", {
                type: "button",
                className: r,
                onClick: () => s((t) => Math.max(1, Math.round(t / 10))),
                children: "÷10",
              }),
              (0, e.jsx)("button", {
                type: "button",
                className: r,
                onClick: () => s(Math.floor(99999 * Math.random())),
                children: "Random",
              }),
            ],
          }),
      ],
    })
  );
});
