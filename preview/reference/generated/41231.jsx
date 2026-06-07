"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "./227113.jsx";
import * as dependency3 from "lucide-react";
import * as dependency4 from "../../../registry/components/number-roll";
import * as dependency7 from "../../../registry/components/split-pane";
import * as dependency8 from "../../../registry/components/text-morph";
import * as dependency9 from "./25369.jsx";
("use strict");
var r = dependency0;
var t = dependency1;
var o = dependency2;
var o = o;
var l = dependency3;
var n = dependency4;
function d(props) {
  return dependency1.createElement(dependency7.SplitPane, props);
}
var u = dependency8;
var p = dependency9;
export default (function ({ tab: e = "code-preview" }) {
  let a = "docs-editor" === e,
    s = "logs" === e,
    [i, c] = t.useState(50);
  return (0, r.jsxs)("div", {
    style: (0, p.demoAppearance)(),
    className: "w-full max-w-[560px] py-4 text-foreground",
    children: [
      (0, r.jsxs)("div", {
        className: "mb-4 flex items-center justify-between",
        children: [
          (0, r.jsx)("span", {
            className:
              "text-[10px] font-mono uppercase tracking-[0.16em] text-muted-foreground",
            children: a
              ? "WORKSPACE / DOCUMENT"
              : s
                ? "RUNNER / TELEMETRY"
                : "DEVTOOL / DUAL SURFACE",
          }),
          (0, r.jsx)(o.default, {
            "aria-hidden": "true",
            className: "size-4 text-primary",
          }),
        ],
      }),
      (0, r.jsxs)("div", {
        className: "mb-6 flex items-baseline justify-between",
        children: [
          (0, r.jsx)("h3", {
            className: "text-[22px] font-medium tracking-[-0.03em]",
            children: (0, r.jsx)(u.TextMorph, {
              children: a
                ? "Markdown editor and live typography"
                : s
                  ? "Process execution trace and inspector"
                  : "Source code and hot component render",
            }),
          }),
          (0, r.jsxs)("span", {
            className:
              "font-mono text-[12px] tabular-nums text-muted-foreground",
            children: [
              (0, r.jsx)(n.NumberRoll, {
                value: Math.round(i),
                suffix: "%",
                duration: 380,
              }),
              " /",
              " ",
              (0, r.jsx)(n.NumberRoll, {
                value: 100 - Math.round(i),
                suffix: "%",
                duration: 380,
              }),
            ],
          }),
        ],
      }),
      (0, r.jsx)("div", {
        className: "h-[280px] w-full",
        children: (0, r.jsx)(d, {
          split: i,
          defaultSplit: 50,
          onSplitCommit: c,
          first: (0, r.jsxs)("div", {
            className:
              "flex h-full flex-col bg-surface/50 p-4 font-mono text-[11px] leading-relaxed text-foreground/80",
            children: [
              (0, r.jsxs)("div", {
                className:
                  "mb-2 flex items-center gap-1.5 border-b border-border/40 pb-2 text-[10px] text-muted-foreground",
                children: [
                  (0, r.jsx)(l.Terminal, { className: "size-3 text-primary" }),
                  (0, r.jsx)("span", {
                    children: a
                      ? "README.md"
                      : s
                        ? "runner.stdout"
                        : "Component.tsx",
                  }),
                ],
              }),
              (0, r.jsx)("div", {
                className: "flex-1 overflow-auto",
                children: a
                  ? (0, r.jsxs)("div", {
                      className: "space-y-2 text-muted-foreground",
                      children: [
                        (0, r.jsx)("p", {
                          className: "text-foreground",
                          children: "# Welcome to Cavemio",
                        }),
                        (0, r.jsx)("p", {
                          children:
                            "Interactions that make software feel remarkably expensive.",
                        }),
                        (0, r.jsx)("p", {
                          className: "text-[10px] text-primary",
                          children: "✓ 1px borders & zero layout lag",
                        }),
                      ],
                    })
                  : s
                    ? (0, r.jsxs)("div", {
                        className:
                          "space-y-1 font-mono text-[10px] text-muted-foreground",
                        children: [
                          (0, r.jsx)("p", {
                            className: "text-emerald-600 dark:text-emerald-400",
                            children: "[00:01] Worker thread booted",
                          }),
                          (0, r.jsx)("p", {
                            children: "[00:03] Binding socket :3000",
                          }),
                          (0, r.jsx)("p", {
                            className: "text-primary",
                            children: "[00:04] Stream connected (24 ops/s)",
                          }),
                        ],
                      })
                    : (0, r.jsxs)("div", {
                        className: "space-y-1 text-muted-foreground",
                        children: [
                          (0, r.jsxs)("p", {
                            children: [
                              (0, r.jsx)("span", {
                                className: "text-primary",
                                children: "export function",
                              }),
                              " App() {",
                            ],
                          }),
                          (0, r.jsxs)("p", {
                            className: "pl-3",
                            children: [
                              "return <",
                              (0, r.jsx)("span", {
                                className: "text-foreground",
                                children: "DemoCard",
                              }),
                              " />;",
                            ],
                          }),
                          (0, r.jsx)("p", { children: "}" }),
                        ],
                      }),
              }),
            ],
          }),
          second: (0, r.jsxs)("div", {
            className: "flex h-full flex-col bg-background p-4 text-sm",
            children: [
              (0, r.jsxs)("div", {
                className:
                  "mb-2 flex items-center justify-between border-b border-border/40 pb-2 text-[10px] font-mono text-muted-foreground",
                children: [
                  (0, r.jsx)("span", { children: "PREVIEW" }),
                  (0, r.jsx)("span", {
                    className: "size-1.5 rounded-full bg-emerald-500",
                  }),
                ],
              }),
              (0, r.jsx)("div", {
                className:
                  "flex flex-1 items-center justify-center p-3 text-center",
                children: (0, r.jsxs)("div", {
                  className:
                    "rounded-xl border border-border bg-surface px-4 py-3",
                  children: [
                    (0, r.jsx)("span", {
                      className: "text-[12px] font-medium text-foreground",
                      children: a
                        ? "Live Typography Specimen"
                        : s
                          ? "Telemetry Active (99.9%)"
                          : "Interactive Render",
                    }),
                    (0, r.jsx)("p", {
                      className: "mt-1 text-[11px] text-muted-foreground",
                      children:
                        "Double-click divider to cycle 50/25/75 presets.",
                    }),
                  ],
                }),
              }),
            ],
          }),
        }),
      }),
      (0, r.jsx)("div", {
        className: "mt-6 flex justify-center gap-1.5",
        children: [
          { label: "Editor Focus (75 / 25)", val: 75 },
          { label: "Balanced (50 / 50)", val: 50 },
          { label: "Preview Focus (25 / 75)", val: 25 },
        ].map((e) =>
          (0, r.jsx)(
            "button",
            {
              type: "button",
              onClick: () => c(e.val),
              className:
                "cursor-pointer rounded-full border border-border px-3 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-border/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              children: e.label,
            },
            e.label,
          ),
        ),
      }),
      (0, r.jsx)("p", {
        className: "mt-4 text-center text-[10px] text-muted-foreground",
        children:
          "Drag divider to resize. Pull past limits to feel rubber-band spring resistance.",
      }),
    ],
  });
});
