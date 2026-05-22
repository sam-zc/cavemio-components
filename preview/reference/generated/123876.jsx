"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/privacy-mask";
("use strict");
var r = dependency0;
function c(props) {
  return dependency1.createElement(dependency2.PrivacyMask, props);
}
export default (function ({ tab: e = "API key" }) {
  return (0, r.jsxs)("div", {
    className:
      "flex w-full max-w-md flex-col items-center justify-center p-2 sm:p-4",
    children: [
      "API key" === e &&
        (0, r.jsxs)("div", {
          className:
            "w-full rounded-2xl border border-border bg-card p-4 sm:p-5 text-card-foreground",
          children: [
            (0, r.jsxs)("div", {
              className:
                "flex items-center justify-between border-b border-border pb-3",
              children: [
                (0, r.jsxs)("div", {
                  children: [
                    (0, r.jsx)("p", {
                      className: "text-[13.5px] font-medium text-foreground",
                      children: "Production API key",
                    }),
                    (0, r.jsx)("p", {
                      className: "text-[12px] text-muted-foreground",
                      children: "Tap anywhere or copy to reveal with auto-hide",
                    }),
                  ],
                }),
                (0, r.jsx)("span", {
                  className:
                    "rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400",
                  children: "Live",
                }),
              ],
            }),
            (0, r.jsxs)("div", {
              className: "mt-5 flex flex-col gap-2",
              children: [
                (0, r.jsx)("span", {
                  className: "text-[12.5px] text-muted-foreground",
                  children: "Secret key",
                }),
                (0, r.jsx)(c, {
                  label: "Stripe secret key",
                  value: "DEMO_KEY_NOT_A_REAL_CREDENTIAL",
                  maskStyle: "blur",
                  autoHideMs: 6e3,
                }),
              ],
            }),
            (0, r.jsxs)("p", {
              className:
                "mt-4 text-[11.5px] text-muted-foreground leading-relaxed",
              children: [
                "Automatically re-masks after 6 seconds of inactivity, or press ",
                (0, r.jsx)("kbd", {
                  className:
                    "rounded border border-border bg-muted px-1 font-mono text-[10.5px]",
                  children: "Esc",
                }),
                " to re-mask immediately.",
              ],
            }),
          ],
        }),
      "Balance" === e &&
        (0, r.jsxs)("div", {
          className:
            "w-full rounded-2xl border border-border bg-card p-4 sm:p-5 text-card-foreground",
          children: [
            (0, r.jsxs)("div", {
              className:
                "flex items-center justify-between border-b border-border pb-3",
              children: [
                (0, r.jsxs)("div", {
                  children: [
                    (0, r.jsx)("p", {
                      className: "text-[13.5px] font-medium text-foreground",
                      children: "Treasury account",
                    }),
                    (0, r.jsx)("p", {
                      className: "text-[12px] text-muted-foreground",
                      children: "Silicon Valley Bank ···· 4821",
                    }),
                  ],
                }),
                (0, r.jsx)("span", {
                  className: "text-xs text-muted-foreground font-mono",
                  children: "USD",
                }),
              ],
            }),
            (0, r.jsxs)("div", {
              className: "mt-5 flex items-center justify-between gap-3",
              children: [
                (0, r.jsx)("span", {
                  className: "text-[13px] text-muted-foreground shrink-0",
                  children: "Available balance",
                }),
                (0, r.jsx)("div", {
                  className: "max-w-[170px] sm:max-w-[200px]",
                  children: (0, r.jsx)(c, {
                    label: "Account balance",
                    value: "$482,910.42",
                    maskStyle: "blur",
                    trigger: "click",
                    copyable: !1,
                  }),
                }),
              ],
            }),
            (0, r.jsxs)("div", {
              className:
                "mt-3 flex items-center justify-between gap-3 border-t border-border/50 pt-3",
              children: [
                (0, r.jsx)("span", {
                  className: "text-[12.5px] text-muted-foreground shrink-0",
                  children: "Routing number",
                }),
                (0, r.jsx)("div", {
                  className: "max-w-[170px] sm:max-w-[200px]",
                  children: (0, r.jsx)(c, {
                    label: "Routing number",
                    value: "121140399",
                    maskStyle: "dots",
                    copyable: !0,
                  }),
                }),
              ],
            }),
          ],
        }),
      "Hold to reveal" === e &&
        (0, r.jsxs)("div", {
          className:
            "w-full rounded-2xl border border-border bg-card p-4 sm:p-5 text-card-foreground",
          children: [
            (0, r.jsxs)("div", {
              className: "border-b border-border pb-3",
              children: [
                (0, r.jsx)("p", {
                  className: "text-[13.5px] font-medium text-foreground",
                  children: "Emergency backup code",
                }),
                (0, r.jsx)("p", {
                  className: "text-[12px] text-muted-foreground",
                  children: "Hold down cursor or finger to view",
                }),
              ],
            }),
            (0, r.jsxs)("div", {
              className: "mt-6 flex flex-col items-center justify-center gap-3",
              children: [
                (0, r.jsx)("div", {
                  className: "w-full max-w-[260px]",
                  children: (0, r.jsx)(c, {
                    label: "Recovery code",
                    value: "RC-8924-4192-K92X",
                    trigger: "hold",
                    maskStyle: "blur",
                    copyable: !0,
                  }),
                }),
                (0, r.jsx)("span", {
                  className: "text-[11.5px] text-muted-foreground",
                  children: "Press and hold to unmask · Release to conceal",
                }),
              ],
            }),
          ],
        }),
    ],
  });
});
