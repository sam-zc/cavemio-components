"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency3 from "../../../registry/components/pricing-toggle";
("use strict");
var r = dependency0;
var t = dependency1;
var a = dependency2;
var o = dependency3;
let l = [
  {
    name: "Starter",
    monthly: 12,
    yearly: 9,
    blurb: "For one person and one product.",
    features: ["1 project", "Community support"],
  },
  {
    name: "Pro",
    monthly: 29,
    yearly: 23,
    blurb: "For founders shipping every week.",
    features: ["10 projects", "Priority support"],
    featured: !0,
  },
  {
    name: "Team",
    monthly: 79,
    yearly: 63,
    blurb: "For small teams that share work.",
    features: ["Unlimited projects", "Shared workspace"],
  },
];
export default (function () {
  let [e, n] = (0, t.useState)("monthly"),
    i = "yearly" === e;
  return (0, r.jsxs)("div", {
    className: "flex w-full max-w-[720px] flex-col items-center gap-8",
    children: [
      (0, r.jsx)(o.PricingToggle, { value: e, onValueChange: n }),
      (0, r.jsx)("div", {
        className:
          "grid w-full grid-cols-1 overflow-hidden rounded-[22px] border border-border sm:grid-cols-3",
        children: l.map((e, t) => {
          let l = i ? e.yearly : e.monthly;
          return (0, r.jsxs)(
            "div",
            {
              className: `flex flex-col p-5 ${t ? "border-t border-border sm:border-l sm:border-t-0" : ""}`,
              children: [
                (0, r.jsxs)("p", {
                  className:
                    "flex items-center gap-2 text-[13px] font-medium text-foreground",
                  children: [
                    e.name,
                    e.featured &&
                      (0, r.jsx)("span", {
                        className:
                          "rounded-full bg-primary/10 px-1.5 py-px text-[10.5px] text-primary",
                        children: "Popular",
                      }),
                  ],
                }),
                (0, r.jsx)(o.Price, {
                  className: "mt-3",
                  amount: l,
                  direction: i ? 1 : -1,
                  note: i
                    ? `$${12 * e.yearly} billed yearly`
                    : "Billed monthly",
                }),
                (0, r.jsx)("p", {
                  className:
                    "mt-3 text-[12.5px] leading-relaxed text-muted-foreground",
                  children: e.blurb,
                }),
                (0, r.jsx)("ul", {
                  className: "mt-3 space-y-1.5",
                  children: e.features.map((e) =>
                    (0, r.jsxs)(
                      "li",
                      {
                        className:
                          "flex items-center gap-2 text-[12.5px] text-foreground/80",
                        children: [
                          (0, r.jsx)(a.Check, {
                            "aria-hidden": "true",
                            className: "size-3.5 text-muted-foreground",
                          }),
                          e,
                        ],
                      },
                      e,
                    ),
                  ),
                }),
                (0, r.jsxs)("button", {
                  type: "button",
                  className: `cursor-pointer mt-5 h-9 rounded-full text-[13px] font-medium transition-[opacity,transform,background-color] active:scale-[0.98] ${e.featured ? "bg-primary text-primary-foreground hover:opacity-90" : "border border-border text-foreground hover:bg-accent"}`,
                  children: ["Get ", e.name],
                }),
              ],
            },
            e.name,
          );
        }),
      }),
    ],
  });
});
