"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/theme-toggle";
("use strict");
var t = dependency0;
var a = dependency1;
var r = dependency2;
let s = "(prefers-color-scheme: dark)";
let n = (e) => {
  let t = window.matchMedia(s);
  return (
    t.addEventListener("change", e),
    () => t.removeEventListener("change", e)
  );
};
export default (function () {
  let [e, d] = (0, a.useState)("light"),
    i = (0, a.useSyncExternalStore)(
      n,
      () => window.matchMedia(s).matches,
      () => !1,
    ),
    l = "dark" === e || ("system" === e && i);
  return (0, t.jsxs)("div", {
    className: `${l ? "dark" : ""} w-full max-w-[460px] rounded-[22px] border border-border bg-background p-5 text-foreground`,
    children: [
      (0, t.jsxs)("div", {
        className: "flex items-center justify-between",
        children: [
          (0, t.jsx)("span", {
            className: "text-[14px] font-medium tracking-[-0.01em]",
            children: "Kept",
          }),
          (0, t.jsx)(r.ThemeToggle, { value: e, onValueChange: d }),
        ],
      }),
      (0, t.jsxs)("div", {
        className: "mt-6 rounded-[16px] border border-border p-4",
        children: [
          (0, t.jsx)("p", {
            className: "text-[12px] text-muted-foreground",
            children: "Tonight’s churn",
          }),
          (0, t.jsx)("p", {
            className: "mt-1 text-[22px] font-medium tracking-[-0.03em]",
            children: "Pistachio, twice",
          }),
          (0, t.jsx)("p", {
            className: "mt-1 text-[13px] leading-relaxed text-muted-foreground",
            children:
              "The Saturday queue empties the tray by four. Start the second batch at noon.",
          }),
        ],
      }),
      (0, t.jsxs)("div", {
        className: "mt-5 flex flex-wrap items-center justify-between gap-3",
        children: [
          (0, t.jsx)(r.ThemeToggle, {
            variant: "segmented",
            value: e,
            onValueChange: d,
          }),
          (0, t.jsx)(r.ThemeToggle, {
            variant: "pill",
            value: e,
            onValueChange: d,
          }),
        ],
      }),
    ],
  });
});
