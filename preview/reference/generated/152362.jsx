"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../icon-factory";
import * as dependency3 from "../../../registry/components/number-roll";
import * as dependency4 from "../../../registry/components/status-button";
import * as dependency5 from "../../../registry/components/tag-input";
import * as dependency6 from "../../../registry/components/text-morph";
import * as dependency7 from "./25369.jsx";
("use strict");
var a = dependency0;
var t = dependency1;
let l = (0, dependency2.default)("ClipboardPaste", [
  [
    "path",
    {
      d: "M15 2H9a1 1 0 0 0-1 1v2c0 .6.4 1 1 1h6c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1Z",
      key: "1pp7kr",
    },
  ],
  [
    "path",
    {
      d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M16 4h2a2 2 0 0 1 2 2v2M11 14h10",
      key: "2ik1ml",
    },
  ],
  ["path", { d: "m17 10 4 4-4 4", key: "vp2hj1" }],
]);
var s = dependency3;
var r = dependency4;
var i = dependency5;
var n = dependency6;
var o = dependency7;
let d = [
  {
    value: "maya@fernhill.co",
    label: "Maya Chen",
    description: "maya@fernhill.co · Design",
  },
  {
    value: "leo@fernhill.co",
    label: "Leo Park",
    description: "leo@fernhill.co · Engineering",
  },
  {
    value: "ana@fernhill.co",
    label: "Ana Ruiz",
    description: "ana@fernhill.co · Support",
  },
  {
    value: "sam@fernhill.co",
    label: "Sam Okafor",
    description: "sam@fernhill.co · Engineering",
  },
  {
    value: "priya@fernhill.co",
    label: "Priya Nair",
    description: "priya@fernhill.co · Product",
  },
  {
    value: "tom@northwind.dev",
    label: "Tom Becker",
    description: "tom@northwind.dev · Northwind",
  },
];
let c = [
  "bug",
  "checkout",
  "billing",
  "performance",
  "mobile",
  "design",
  "onboarding",
  "needs review",
].map((e) => ({ value: e }));
let m =
  "maya@fernhill.co, leo@fernhill.co\njo@northwind.dev; maya@fernhill.co, not-an-email, priya@fernhill.co";
let u = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let p = /[\s,;]+/;
let h = (e) => e.toLowerCase();
let x = (e) => e.toLowerCase().replace(/\s+/g, " ");
let f = (e) =>
  new Promise((a) => {
    let t = d.find((a) => a.value === e);
    setTimeout(
      () => a(t?.label ? { label: t.label } : null),
      650 + 450 * Math.random(),
    );
  });
let b = (e) =>
  u.test(e) ? null : `“${e}” isn’t an email address. Click it twice to fix it.`;
function g({ tab: e }) {
  let o = t.default.useRef(null),
    c = "Seat limit" === e,
    [u, x] = t.default.useState(() =>
      c
        ? [{ id: "seed-maya", value: "maya@fernhill.co", label: "Maya Chen" }]
        : "Invite" === e
          ? [{ id: "seed-leo", value: "leo@fernhill.co", label: "Leo Park" }]
          : [],
    ),
    [v, j] = t.default.useState("idle"),
    y = u.filter((e) => !e.error).length,
    N = u.length - y,
    k = 3 - u.length;
  return (0, a.jsxs)("div", {
    className: "rounded-[22px] border border-border bg-background p-4 sm:p-5",
    children: [
      (0, a.jsxs)("div", {
        className: "flex items-baseline justify-between gap-3",
        children: [
          (0, a.jsx)("p", {
            className: "text-[14px] font-medium tracking-[-0.01em]",
            children: "Invite to Relay",
          }),
          (0, a.jsx)("p", {
            className: "text-[11.5px] tabular-nums text-muted-foreground",
            children: c
              ? (0, a.jsxs)(a.Fragment, {
                  children: [
                    (0, a.jsx)(s.NumberRoll, { value: Math.max(0, k) }),
                    " ",
                    (0, a.jsx)(n.TextMorph, {
                      children: 1 === k ? "seat left" : "seats left",
                    }),
                  ],
                })
              : "Fernhill · Workspace",
          }),
        ],
      }),
      (0, a.jsx)(i.TagInput, {
        ref: o,
        className: "mt-3.5",
        value: u,
        onValueChange: (e) => {
          (x(e), "pending" !== v && j("idle"));
        },
        label: "Invite by name or email",
        placeholder: "Names or emails",
        hint: c
          ? "Starter includes three seats."
          : "Separate with commas, or paste a list.",
        suggestions: d,
        resolve: f,
        validate: b,
        normalize: h,
        separators: p,
        createLabel: (e) => `Invite “${e}”`,
        max: c ? 3 : void 0,
        limitMessage: "No seats left on Starter. Upgrade for more.",
        collapse: 2,
      }),
      (0, a.jsxs)("div", {
        className: "mt-4 flex items-center justify-between gap-3",
        children: [
          (0, a.jsxs)("p", {
            className:
              "flex items-baseline whitespace-nowrap text-[12.5px] tabular-nums text-muted-foreground",
            children: [
              (0, a.jsx)(s.NumberRoll, { value: y }),
              (0, a.jsx)(n.TextMorph, {
                className: "ml-1",
                children: 1 === y ? "person" : "people",
              }),
              (0, a.jsx)("span", {
                className:
                  "grid transition-[grid-template-columns,opacity] duration-300",
                style: {
                  gridTemplateColumns: N ? "1fr" : "0fr",
                  opacity: +!!N,
                  transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                },
                children: (0, a.jsx)("span", {
                  className:
                    "min-w-0 text-red-600 [clip-path:inset(-4px_-2px)] dark:text-red-400",
                  children: (0, a.jsxs)("span", {
                    className: "flex items-baseline pl-1.5",
                    children: [
                      "· ",
                      (0, a.jsx)(s.NumberRoll, { value: N || 1 }),
                      " to fix",
                    ],
                  }),
                }),
              }),
            ],
          }),
          (0, a.jsx)(r.StatusButton, {
            status: v,
            labels: {
              idle: "Send invites",
              pending: "Sending",
              success: "Invites sent",
              error: "Try again",
            },
            onClick: () => {
              y &&
                "pending" !== v &&
                (j("pending"),
                setTimeout(() => {
                  (j("success"), setTimeout(() => o.current?.clear(), 700));
                }, 1100));
            },
            onReset: () => j("idle"),
            resetAfter: 2200,
            "aria-disabled": !y || void 0,
            className: y ? "" : "pointer-events-none opacity-50",
          }),
        ],
      }),
      "Paste a list" === e &&
        (0, a.jsxs)("div", {
          className: "mt-4 border-t border-border pt-3.5",
          children: [
            (0, a.jsx)("p", {
              className: "text-[11.5px] text-muted-foreground",
              children: "A list from a spreadsheet, with a repeat and a typo:",
            }),
            (0, a.jsxs)("div", {
              className: "mt-2 flex items-start gap-2",
              children: [
                (0, a.jsx)("code", {
                  className:
                    "min-w-0 flex-1 whitespace-pre-wrap break-all font-mono text-[11px] leading-[1.55] text-muted-foreground",
                  children: m,
                }),
                (0, a.jsxs)("button", {
                  type: "button",
                  onClick: () => o.current?.paste(m),
                  className:
                    "inline-flex h-7 shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-2.5 text-[12px] font-medium shadow-[inset_0_0_0_1px_var(--border)] transition-colors hover:bg-accent",
                  children: [
                    (0, a.jsx)(l, {
                      className: "size-3.5 text-muted-foreground",
                      strokeWidth: 1.75,
                      "aria-hidden": "true",
                    }),
                    "Paste it",
                  ],
                }),
              ],
            }),
          ],
        }),
    ],
  });
}
function v() {
  let [e, l] = t.default.useState([
    { id: "seed-bug", value: "bug" },
    { id: "seed-checkout", value: "checkout" },
  ]);
  return (0, a.jsxs)("div", {
    className: "rounded-[22px] border border-border bg-background p-4 sm:p-5",
    children: [
      (0, a.jsx)("p", {
        className: "text-[11.5px] text-muted-foreground",
        children: "REL-482 · Relay",
      }),
      (0, a.jsx)("p", {
        className: "mt-1 text-[14px] font-medium tracking-[-0.01em]",
        children: "Checkout times out on slow networks",
      }),
      (0, a.jsx)(i.TagInput, {
        className: "mt-3.5",
        value: e,
        onValueChange: l,
        label: "Labels",
        placeholder: "Add a label",
        hint: `${e.length} label${1 === e.length ? "" : "s"} \xb7 type to filter or create one`,
        suggestions: c,
        normalize: x,
        createLabel: (e) => `Create “${x(e)}”`,
      }),
    ],
  });
}
export default (function ({ tab: e = "Invite" }) {
  return (0, a.jsx)("div", {
    style: (0, o.demoAppearance)(),
    className: "w-full max-w-[460px] text-foreground",
    children: "Labels" === e ? (0, a.jsx)(v, {}) : (0, a.jsx)(g, { tab: e }, e),
  });
});
