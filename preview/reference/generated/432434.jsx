"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/text-morph";
import * as dependency3 from "../../../registry/components/cookie-banner";
("use strict");
var t = dependency0;
var r = dependency1;
var s = dependency2;
let n = "cookie-preferences:open";
function o() {
  window.dispatchEvent(new Event(n));
}
function b(props) {
  return dependency1.createElement(dependency3.CookieBanner, props);
}
let g = "cavemio-demo-cookie-consent";
export default (function () {
  let [e, n] = (0, r.useState)(null),
    [i, a] = (0, r.useState)(0);
  return (0, t.jsxs)("div", {
    className: "w-full max-w-[640px]",
    children: [
      (0, t.jsxs)("div", {
        className:
          "relative h-[500px] overflow-hidden rounded-[22px] border border-border bg-background text-foreground",
        children: [
          (0, t.jsxs)("div", {
            className:
              "flex items-center justify-between border-b border-border px-5 py-3.5",
            children: [
              (0, t.jsx)("span", {
                className: "text-[14px] font-medium tracking-[-0.01em]",
                children: "Kept",
              }),
              (0, t.jsx)("span", {
                className: "text-[12px] text-muted-foreground",
                children: "Point of sale for small shops",
              }),
            ],
          }),
          (0, t.jsxs)("div", {
            className: "px-5 pt-10 sm:px-8",
            children: [
              (0, t.jsx)("p", {
                className:
                  "max-w-[16ch] text-[26px] font-medium leading-[1.1] tracking-[-0.03em] sm:text-[32px]",
                children: "The till that knows your Saturdays.",
              }),
              (0, t.jsx)("p", {
                className:
                  "mt-3 max-w-[40ch] text-[13px] leading-relaxed text-muted-foreground",
                children:
                  "Orders, stock and rotas in one place, so the queue moves and nothing runs out.",
              }),
            ],
          }),
          (0, t.jsx)("div", {
            className:
              "absolute inset-x-0 bottom-0 flex items-center justify-end gap-4 px-5 pb-[26px] text-[12px] text-muted-foreground",
            children: (0, t.jsx)("button", {
              type: "button",
              onClick: o,
              className:
                "cursor-pointer rounded-sm underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
              children: "Cookie settings",
            }),
          }),
          (0, t.jsx)(
            b,
            {
              strategy: "absolute",
              storageKey: g,
              policyHref: "#cookies",
              onConsentChange: async (e, t) => {
                (n(e),
                  "save" === t &&
                    (await new Promise((e) => window.setTimeout(e, 700))));
              },
            },
            i,
          ),
        ],
      }),
      (0, t.jsxs)("div", {
        className:
          "mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-1 text-[12.5px]",
        children: [
          (0, t.jsxs)("p", {
            className: "text-muted-foreground",
            children: [
              "Loaded: ",
              (0, t.jsx)(s.TextMorph, {
                className: "text-foreground",
                children: ((e) => {
                  if (!e) return "Nothing yet, waiting for an answer";
                  let t = ["analytics", "marketing"].filter((t) => e[t]);
                  return t.length
                    ? `Necessary, ${t.join(" and ")}`
                    : "Only what’s necessary";
                })(e),
              }),
            ],
          }),
          (0, t.jsx)("button", {
            type: "button",
            onClick: () => {
              try {
                localStorage.removeItem(g);
              } catch {}
              (n(null), a((e) => e + 1));
            },
            className:
              "cursor-pointer rounded-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
            children: "Forget my choice",
          }),
        ],
      }),
    ],
  });
});
