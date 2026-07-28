"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../icon-factory";
import * as dependency3 from "lucide-react";
import * as dependency5 from "../../../registry/components/mention-menu";
("use strict");
var t = dependency0;
var n = dependency1;
var r = dependency2;
let a = (0, r.default)("AlignLeft", [
  ["path", { d: "M15 12H3", key: "6jk70r" }],
  ["path", { d: "M17 18H3", key: "1amg6g" }],
  ["path", { d: "M21 6H3", key: "1jwq7v" }],
]);
var i = dependency3;
var o = dependency3;
var l = dependency3;
var s = dependency3;
let d = (0, r.default)("Languages", [
  ["path", { d: "m5 8 6 6", key: "1wu5hv" }],
  ["path", { d: "m4 14 6-6 2-3", key: "1k1g8d" }],
  ["path", { d: "M2 5h12", key: "or177f" }],
  ["path", { d: "M7 2h1", key: "1t2jsx" }],
  ["path", { d: "m22 22-5-10-5 10", key: "don7ne" }],
  ["path", { d: "M14 18h6", key: "1m8k6r" }],
]);
let c = (0, r.default)("Lightbulb", [
  [
    "path",
    {
      d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
      key: "1gvzjb",
    },
  ],
  ["path", { d: "M9 18h6", key: "x1upvd" }],
  ["path", { d: "M10 22h4", key: "ceow96" }],
]);
var u = dependency3;
let m = (0, r.default)("UserRound", [
  ["circle", { cx: "12", cy: "8", r: "5", key: "1hypcn" }],
  ["path", { d: "M20 21a8 8 0 0 0-16 0", key: "rfgkzh" }],
]);
function w(props) {
  return dependency1.createElement(dependency5.MentionInput, props);
}
let j = [
  {
    id: "q3",
    label: "q3-flavor-sales.pdf",
    description: "Report · 2.4 MB",
    icon: (0, t.jsx)(l.FileText, {}),
  },
  {
    id: "menu",
    label: "autumn-menu.csv",
    description: "Sheet · 14 rows",
    icon: (0, t.jsx)(o.FileSpreadsheet, {}),
  },
  {
    id: "notes",
    label: "onboarding-notes.md",
    description: "Doc · edited today",
    icon: (0, t.jsx)(l.FileText, {}),
  },
  {
    id: "ana",
    label: "Ana Ruiz",
    description: "Shift lead",
    icon: (0, t.jsx)(m, {}),
  },
  {
    id: "site",
    label: "kept-icecream.com",
    description: "Website",
    icon: (0, t.jsx)(s.Globe, {}),
  },
  {
    id: "brand",
    label: "brand-guide.pdf",
    description: "Guide · 18 pages",
    icon: (0, t.jsx)(l.FileText, {}),
  },
];
let N = [
  {
    char: "@",
    label: "Context",
    items: (e) =>
      new Promise((t) =>
        window.setTimeout(
          () =>
            t(
              j.filter(
                (t) =>
                  t.label.toLowerCase().includes(e.toLowerCase()) ||
                  (t.description ?? "").toLowerCase().includes(e.toLowerCase()),
              ),
            ),
          260,
        ),
      ),
  },
  {
    char: "/",
    label: "Commands",
    items: [
      {
        id: "summarize",
        label: "summarize",
        description: "Key points in a few lines",
        icon: (0, t.jsx)(a, {}),
      },
      {
        id: "translate",
        label: "translate",
        description: "Into another language",
        icon: (0, t.jsx)(d, {}),
      },
      {
        id: "explain",
        label: "explain",
        description: "In plain words",
        icon: (0, t.jsx)(c, {}),
      },
      {
        id: "todo",
        label: "todo",
        description: "Turn it into tasks",
        icon: (0, t.jsx)(u.ListTodo, {}),
      },
    ],
    startOnly: !0,
    variant: "command",
  },
];
let M = [
  { type: "mention", trigger: "/", id: "summarize", label: "summarize" },
  { type: "text", text: " the weekend numbers in " },
  { type: "mention", trigger: "@", id: "q3", label: "q3-flavor-sales.pdf" },
  { type: "text", text: " for " },
  { type: "mention", trigger: "@", id: "ana", label: "Ana Ruiz" },
];
function T({ segments: e }) {
  return (0, t.jsx)("p", {
    className:
      "ml-auto w-fit max-w-[85%] animate-[ui-fade-up_300ms_cubic-bezier(0.23,1,0.32,1)_both] motion-reduce:animate-none whitespace-pre-wrap rounded-2xl bg-muted px-3.5 py-2 text-[13.5px] leading-relaxed text-foreground",
    children: e.map((e, r) =>
      "text" === e.type
        ? (0, t.jsx)(n.default.Fragment, { children: e.text }, r)
        : (0, t.jsxs)(
            "span",
            {
              className:
                "/" === e.trigger
                  ? "mx-px rounded-md bg-background px-1 font-mono text-[0.92em]"
                  : "mx-px rounded-md bg-primary/10 px-1 font-medium text-primary",
              children: [
                (0, t.jsx)("span", {
                  className: "opacity-50",
                  children: e.trigger,
                }),
                e.label,
              ],
            },
            r,
          ),
    ),
  });
}
export default (function ({ tab: e = "Try it" }) {
  let r = (0, n.useRef)(null),
    a = (0, n.useRef)(null),
    [o, l] = (0, n.useState)(null),
    [s, d] = (0, n.useState)(null),
    c = !!o?.segments.length,
    u = (e) => {
      e?.segments.length && (d(e.segments), r.current?.clear());
    };
  return (0, t.jsxs)("div", {
    className:
      "flex min-h-[340px] w-full max-w-[500px] flex-col justify-end gap-4",
    children: [
      s && (0, t.jsx)(T, { segments: s }, JSON.stringify(s)),
      (0, t.jsxs)("div", {
        ref: a,
        className: "rounded-[22px] border border-border bg-background p-2",
        children: [
          (0, t.jsx)(w, {
            ref: r,
            triggers: N,
            anchorRef: a,
            defaultValue: "With context" === e ? M : void 0,
            onChange: l,
            onSubmit: u,
            placeholder: "Ask anything",
            className:
              "px-2.5 pb-1 pt-1.5 text-[14px] leading-6 text-foreground",
          }),
          (0, t.jsxs)("div", {
            className: "flex items-center justify-between pl-2.5",
            children: [
              (0, t.jsxs)("span", {
                className: "text-[12px] text-muted-foreground",
                children: [
                  (0, t.jsx)("kbd", { className: "font-sans", children: "@" }),
                  " for context · ",
                  (0, t.jsx)("kbd", { className: "font-sans", children: "/" }),
                  " for commands",
                ],
              }),
              (0, t.jsx)("button", {
                type: "button",
                "aria-label": "Send",
                disabled: !c,
                onClick: () => u(o),
                className:
                  "cursor-pointer disabled:cursor-default flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-[opacity,transform] duration-150 active:scale-[0.94] disabled:opacity-30",
                children: (0, t.jsx)(i.ArrowUp, {
                  className: "size-4",
                  strokeWidth: 2.4,
                }),
              }),
            ],
          }),
        ],
      }),
    ],
  });
});
