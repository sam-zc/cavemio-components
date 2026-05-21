"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "lucide-react";
import * as dependency2 from "./42899.jsx";
import * as dependency3 from "../icon-factory";
import * as dependency4 from "react";
import * as dependency5 from "../../../registry/components/morphing-nav";
("use strict");
var t = dependency0;
var n = dependency1;
var r = dependency1;
var i = dependency1;
var s = dependency1;
var a = dependency2;
var o = dependency1;
var l = dependency3;
let d = (0, l.default)("Newspaper", [
  [
    "path",
    {
      d: "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2",
      key: "7pis2x",
    },
  ],
  ["path", { d: "M18 14h-8", key: "sponae" }],
  ["path", { d: "M15 18h-5", key: "95g1m2" }],
  ["path", { d: "M10 6h8v4h-8V6Z", key: "smlsk5" }],
]);
let c = (0, l.default)("Plug", [
  ["path", { d: "M12 22v-5", key: "1ega77" }],
  ["path", { d: "M9 8V2", key: "14iosj" }],
  ["path", { d: "M15 8V2", key: "18g5xt" }],
  ["path", { d: "M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z", key: "osxo6l" }],
]);
let u = (0, l.default)("Rocket", [
  [
    "path",
    {
      d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",
      key: "m3kijz",
    },
  ],
  [
    "path",
    {
      d: "m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",
      key: "1fmvmk",
    },
  ],
  ["path", { d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0", key: "1f8sc4" }],
  ["path", { d: "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5", key: "qeys4" }],
]);
let f = (0, l.default)("ShieldCheck", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y",
    },
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }],
]);
var h = dependency1;
let p = (0, l.default)("Workflow", [
  ["rect", { width: "8", height: "8", x: "3", y: "3", rx: "2", key: "by2w9f" }],
  ["path", { d: "M7 11v4a2 2 0 0 0 2 2h4", key: "xkn7yn" }],
  [
    "rect",
    { width: "8", height: "8", x: "13", y: "13", rx: "2", key: "1cgmvn" },
  ],
]);
function w(props) {
  return dependency4.createElement(dependency5.MorphingNav, props);
}
function v({ icon: e, title: n, text: r }) {
  return (0, t.jsxs)("a", {
    href: "#",
    onClick: (e) => e.preventDefault(),
    className: `group flex ${r ? "items-start" : "items-center"} gap-3 rounded-xl p-2.5 outline-none transition-colors hover:bg-accent focus-visible:bg-accent`,
    children: [
      (0, t.jsx)("span", {
        className:
          "flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)] transition-colors group-hover:text-foreground [&_svg]:size-4 [&_svg]:stroke-[1.8]",
        children: e,
      }),
      (0, t.jsxs)("span", {
        className: "min-w-0",
        children: [
          (0, t.jsx)("span", {
            className: "block text-[13px] font-medium text-foreground",
            children: n,
          }),
          r &&
            (0, t.jsx)("span", {
              className:
                "mt-0.5 block text-[12px] leading-snug text-muted-foreground",
              children: r,
            }),
        ],
      }),
    ],
  });
}
let b = [
  {
    id: "product",
    label: "Product",
    content: (0, t.jsxs)("div", {
      className: "grid w-[480px] grid-cols-2 gap-0.5 p-2",
      children: [
        (0, t.jsx)(v, {
          icon: (0, t.jsx)(p, {}),
          title: "Workflows",
          text: "Chain steps that run on their own.",
        }),
        (0, t.jsx)(v, {
          icon: (0, t.jsx)(a.ChartColumn, {}),
          title: "Insights",
          text: "See what moves your numbers.",
        }),
        (0, t.jsx)(v, {
          icon: (0, t.jsx)(c, {}),
          title: "Integrations",
          text: "Forty tools, connected in a click.",
        }),
        (0, t.jsx)(v, {
          icon: (0, t.jsx)(f, {}),
          title: "Security",
          text: "SSO, audit logs and roles.",
        }),
      ],
    }),
  },
  {
    id: "solutions",
    label: "Solutions",
    content: (0, t.jsxs)("div", {
      className: "flex w-[300px] flex-col gap-0.5 p-2",
      children: [
        (0, t.jsx)(v, {
          icon: (0, t.jsx)(u, {}),
          title: "Startups",
          text: "Launch in a weekend.",
        }),
        (0, t.jsx)(v, {
          icon: (0, t.jsx)(h.Users, {}),
          title: "Agencies",
          text: "One workspace per client.",
        }),
        (0, t.jsx)(v, {
          icon: (0, t.jsx)(s.Building2, {}),
          title: "Enterprise",
          text: "Scale with controls.",
        }),
      ],
    }),
  },
  {
    id: "resources",
    label: "Resources",
    content: (0, t.jsxs)("div", {
      className: "flex w-[400px] gap-2 p-2",
      children: [
        (0, t.jsxs)("div", {
          className: "flex flex-1 flex-col gap-0.5",
          children: [
            (0, t.jsx)(v, { icon: (0, t.jsx)(r.BookOpen, {}), title: "Docs" }),
            (0, t.jsx)(v, {
              icon: (0, t.jsx)(i.Boxes, {}),
              title: "Templates",
            }),
            (0, t.jsx)(v, {
              icon: (0, t.jsx)(o.LifeBuoy, {}),
              title: "Support",
            }),
          ],
        }),
        (0, t.jsxs)("a", {
          href: "#",
          onClick: (e) => e.preventDefault(),
          className:
            "group flex w-[170px] flex-col justify-between rounded-xl p-3 shadow-[inset_0_0_0_1px_var(--border)] outline-none transition-colors hover:bg-accent focus-visible:bg-accent",
          children: [
            (0, t.jsx)(d, { className: "size-4 text-muted-foreground" }),
            (0, t.jsxs)("span", {
              children: [
                (0, t.jsxs)("span", {
                  className:
                    "flex items-center gap-1 text-[13px] font-medium text-foreground",
                  children: [
                    "Changelog",
                    (0, t.jsx)(n.ArrowUpRight, {
                      className:
                        "size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                    }),
                  ],
                }),
                (0, t.jsx)("span", {
                  className:
                    "mt-0.5 block text-[12px] leading-snug text-muted-foreground",
                  children: "Agents can now hand off to each other.",
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  },
  { id: "pricing", label: "Pricing", href: "#" },
  { id: "changelog", label: "Changelog", href: "#" },
];
export default (function () {
  return (0, t.jsxs)("div", {
    className: "flex min-h-[300px] w-full max-w-[640px] flex-col",
    children: [
      (0, t.jsxs)("header", {
        className:
          "flex items-center justify-between gap-4 rounded-full border border-border bg-background py-1.5 pl-4 pr-1.5",
        children: [
          (0, t.jsx)("span", {
            className:
              "text-[14px] font-semibold tracking-[-0.02em] text-foreground",
            children: "Relay",
          }),
          (0, t.jsx)(w, { items: b, className: "hidden sm:block" }),
          (0, t.jsx)("a", {
            href: "#",
            onClick: (e) => e.preventDefault(),
            className:
              "h-9 shrink-0 whitespace-nowrap rounded-full bg-primary px-4 text-[13px] font-medium leading-9 text-primary-foreground",
            children: "Start free",
          }),
        ],
      }),
      (0, t.jsx)("p", {
        className:
          "mt-6 text-center text-[12.5px] text-muted-foreground sm:hidden",
        children: "Open this on a wider screen to try the menu.",
      }),
    ],
  });
});
