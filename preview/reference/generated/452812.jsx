"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency3 from "../../../registry/components/status-button";
("use strict");
var r = dependency0;
var t = dependency1;
var s = dependency2;
var n = dependency3;
export default (function ({ tab: e = "Save" }) {
  let [i, o] = (0, t.useState)("idle"),
    a = (0, t.useRef)(0),
    l = (0, t.useRef)(void 0);
  return ((0, t.useEffect)(() => () => window.clearTimeout(l.current), []),
  "Copy" === e)
    ? (0, r.jsx)(n.StatusButton, {
        variant: "outline",
        icon: (0, r.jsx)(s.Link2, {}),
        status: i,
        labels: { idle: "Copy link", success: "Copied" },
        onClick: () => o("success"),
        onReset: () => o("idle"),
      })
    : (0, r.jsxs)("div", {
        className: "flex w-full max-w-[340px] flex-col gap-4",
        children: [
          (0, r.jsxs)("label", {
            className:
              "flex flex-col gap-1.5 text-[12.5px] text-muted-foreground",
            children: [
              "Shop name",
              (0, r.jsx)("input", {
                defaultValue: "Kept · Harbour Road",
                className:
                  "h-10 rounded-xl px-3 text-[14px] text-foreground shadow-[inset_0_0_0_1px_var(--border)] outline-none focus:shadow-[inset_0_0_0_1px_var(--ring)]",
              }),
            ],
          }),
          (0, r.jsx)("div", {
            className: "flex justify-end",
            children: (0, r.jsx)(n.StatusButton, {
              status: i,
              labels: {
                idle: "Save changes",
                pending: "Saving",
                success: "Saved",
                error: "Try again",
              },
              onClick: () => {
                o("pending");
                let r = "Error" === e && 0 == a.current++;
                l.current = window.setTimeout(
                  () => o(r ? "error" : "success"),
                  1200,
                );
              },
              onReset: () => o("idle"),
            }),
          }),
        ],
      });
});
