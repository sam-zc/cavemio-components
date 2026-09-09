"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/web-research";
("use strict");
var t = dependency0;
var n = dependency1;
var r = dependency2;
let s = [
  {
    query: { text: "annual plan discount benchmarks", results: 5 },
    sources: [
      {
        url: "https://pricingbench.co/annual-plans",
        title: "Annual plan discounts: what most teams offer",
      },
      {
        url: "https://growthledger.com/retention-2026",
        title: "Retention by billing cycle, 2026 edition",
      },
      {
        url: "https://productweekly.net/pricing-pages",
        title: "What a pricing page needs above the fold",
      },
    ],
  },
  {
    query: {
      text: "switching customers to annual billing",
      site: "threadly.com",
      results: 12,
      resultLabel: "threads",
    },
    sources: [
      {
        url: "https://threadly.com/t/annual-billing-switch",
        title: "Did moving to annual billing hurt signups?",
      },
      {
        url: "https://threadly.com/t/two-months-free",
        title: "Two months free or 15% off? Results inside",
      },
    ],
  },
  {
    query: {
      text: "pricing page launch week",
      site: "postboard.com",
      results: 7,
      resultLabel: "posts",
    },
    sources: [
      {
        url: "https://postboard.com/launchnotes/pricing-week",
        title: "A thread on launching a new pricing page",
      },
      {
        url: "https://postboard.com/checkoutlab/finish-rate",
        title: "Designing a checkout people finish",
      },
    ],
  },
];
let i = s.map((e) => e.query);
let a = s.flatMap((e, t) => e.sources.map((e) => ({ ...e, query: t })));
export default (function ({ tab: e = "Live" }) {
  let [l, o] = (0, n.useState)(
      "Live" === e ? "searching" : "Failed" === e ? "error" : "done",
    ),
    [c, d] = (0, n.useState)(
      "Live" === e ? [i[0]] : "Failed" === e ? i.slice(0, 2) : i,
    ),
    [u, h] = (0, n.useState)(
      "Live" === e ? [] : "Failed" === e ? a.slice(0, 4) : a,
    );
  return (
    (0, n.useEffect)(() => {
      if ("Live" !== e) return;
      let t = [],
        n = 0;
      return (
        s.forEach((e, r) => {
          (r > 0 &&
            t.push(
              window.setTimeout(
                () => (o("searching"), d((t) => [...t, e.query])),
                n,
              ),
            ),
            (n += 1300),
            e.sources.forEach((e, s) => {
              t.push(
                window.setTimeout(
                  () => (o("reading"), h((t) => [...t, { ...e, query: r }])),
                  n + 420 * s,
                ),
              );
            }),
            (n += 420 * e.sources.length + 500));
        }),
        t.push(window.setTimeout(() => o("done"), n)),
        () => t.forEach((e) => window.clearTimeout(e))
      );
    }, [e]),
    (0, t.jsxs)("div", {
      className: "w-full max-w-[460px]",
      children: [
        (0, t.jsx)(r.WebResearch, {
          status: l,
          queries: c,
          sources: u,
          defaultOpen: "Done" === e,
        }),
        "done" === l &&
          "Live" === e &&
          (0, t.jsx)("p", {
            className:
              "mt-3 text-[13.5px] leading-relaxed text-foreground animate-[ui-fade-up_320ms_cubic-bezier(0.23,1,0.32,1)_both]",
            children:
              "Most teams give two months free on annual plans, so a 17% discount for launch week keeps you in line…",
          }),
      ],
    })
  );
});
