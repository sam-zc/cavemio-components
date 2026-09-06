"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency5 from "../../../registry/components/usage-meter";
("use strict");
var r = dependency0;
var t = dependency1;
var s = dependency2;
var a = dependency2;
function x(props) {
  return dependency1.createElement(dependency5.UsageMeter, props);
}
export default (function ({ tab: e = "Normal" }) {
  let [i, n] = (0, t.useState)("Low" === e ? 1700 : "Out" === e ? 2e3 : 760),
    [o] = (0, t.useState)(() => Date.now() + 3456e5);
  return "Ring" === e
    ? (0, r.jsx)("div", {
        className: "flex w-full max-w-[420px] flex-col gap-3",
        children: [42e3, 109e3, 128e3].map((e) =>
          (0, r.jsxs)(
            "div",
            {
              className:
                "flex items-center justify-between rounded-full border border-border py-1.5 pl-3 pr-1.5",
              children: [
                (0, r.jsxs)("span", {
                  className: "flex items-center gap-3 text-muted-foreground",
                  children: [
                    (0, r.jsx)(a.Paperclip, {
                      "aria-hidden": "true",
                      className: "size-4",
                    }),
                    (0, r.jsx)(x, {
                      variant: "ring",
                      label: "Context",
                      unit: "tokens",
                      used: e,
                      limit: 128e3,
                    }),
                  ],
                }),
                (0, r.jsx)("span", {
                  "aria-hidden": "true",
                  className:
                    "flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground",
                  children: (0, r.jsx)(s.ArrowUp, { className: "size-3.5" }),
                }),
              ],
            },
            e,
          ),
        ),
      })
    : (0, r.jsxs)("div", {
        className: "w-full max-w-[380px]",
        children: [
          (0, r.jsx)(x, {
            used: i,
            limit: 2e3,
            unit: "credits",
            label: "Credits",
            resetAt: o,
            onUpgrade: () => {},
            upgradeLabel: "Upgrade to Pro",
          }),
          (0, r.jsxs)("div", {
            className: "mt-5 flex gap-4 text-[12px]",
            children: [
              (0, r.jsx)("button", {
                type: "button",
                disabled: i >= 2e3,
                onClick: () => n((e) => Math.min(2e3, e + 220)),
                className:
                  "cursor-pointer disabled:cursor-default text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground disabled:opacity-40",
                children: "Use 220 credits",
              }),
              (0, r.jsx)("button", {
                type: "button",
                onClick: () => n("Low" === e ? 1700 : "Out" === e ? 2e3 : 760),
                className:
                  "cursor-pointer text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground",
                children: "Reset",
              }),
            ],
          }),
        ],
      });
});
