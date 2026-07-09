"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "../../../registry/components/copy-button";
("use strict");
var t = dependency0;
var s = dependency1;
export default (function ({ tab: e = "Icon Only" }) {
  return "With Label" === e
    ? (0, t.jsxs)("div", {
        className:
          "flex w-full max-w-[340px] flex-col items-center justify-center gap-4 py-4 px-2",
        children: [
          (0, t.jsxs)("div", {
            className:
              "flex w-full items-center justify-between gap-2.5 rounded-[9px] border border-border bg-card p-1.5 pl-3",
            children: [
              (0, t.jsx)("span", {
                className:
                  "truncate min-w-0 flex-1 font-mono text-[12px] text-foreground select-all",
                children: "pnpm dlx shadcn@4.21.5 add @cavemio/button",
              }),
              (0, t.jsx)(s.CopyButton, {
                text: "pnpm dlx shadcn@4.21.5 add @cavemio/button",
                showLabel: !0,
                variant: "secondary",
                size: "sm",
                className: "shrink-0",
              }),
            ],
          }),
          (0, t.jsx)("span", {
            className:
              "text-center text-[12px] text-muted-foreground max-w-[280px] leading-relaxed",
            children: "The label morphs to Copied on the press itself",
          }),
        ],
      })
    : "Outline" === e
      ? (0, t.jsxs)("div", {
          className:
            "flex w-full max-w-[340px] flex-col items-center justify-center gap-4 py-4 px-2",
          children: [
            (0, t.jsxs)("div", {
              className:
                "flex w-full items-center justify-between gap-2.5 rounded-[9px] border border-border p-2 pl-3",
              children: [
                (0, t.jsx)("span", {
                  className:
                    "truncate min-w-0 flex-1 font-mono text-[12px] text-foreground font-medium select-all",
                  children: "sk_live_984f18b329a17e0",
                }),
                (0, t.jsx)(s.CopyButton, {
                  text: "sk_live_984f18b329a17e0",
                  variant: "outline",
                  size: "sm",
                  showLabel: !0,
                  label: "Copy key",
                  copiedLabel: "Copied",
                  className: "shrink-0",
                }),
              ],
            }),
            (0, t.jsx)("span", {
              className: "text-center text-[12px] text-muted-foreground",
              children: "Outline, for API keys and secrets",
            }),
          ],
        })
      : "Sizes" === e
        ? (0, t.jsxs)("div", {
            className:
              "flex w-full max-w-[340px] flex-col items-center justify-center gap-5 py-4 px-2",
            children: [
              (0, t.jsxs)("div", {
                className: "flex items-center justify-center gap-3",
                children: [
                  (0, t.jsx)(s.CopyButton, {
                    text: "bun run build",
                    size: "xs",
                    variant: "secondary",
                  }),
                  (0, t.jsx)(s.CopyButton, {
                    text: "bun run build",
                    size: "sm",
                    variant: "secondary",
                  }),
                  (0, t.jsx)(s.CopyButton, {
                    text: "bun run build",
                    size: "md",
                    variant: "secondary",
                  }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: "flex items-center justify-center gap-3",
                children: [
                  (0, t.jsx)(s.CopyButton, {
                    text: "bun run build",
                    size: "xs",
                    variant: "secondary",
                    showLabel: !0,
                  }),
                  (0, t.jsx)(s.CopyButton, {
                    text: "bun run build",
                    size: "sm",
                    variant: "secondary",
                    showLabel: !0,
                  }),
                  (0, t.jsx)(s.CopyButton, {
                    text: "bun run build",
                    size: "md",
                    variant: "secondary",
                    showLabel: !0,
                  }),
                ],
              }),
              (0, t.jsx)("span", {
                className: "text-center text-[12px] text-muted-foreground",
                children: "24, 28 and 36px, icon only or labelled",
              }),
            ],
          })
        : (0, t.jsxs)("div", {
            className:
              "flex w-full max-w-[340px] flex-col items-center justify-center gap-4 py-4 px-2",
            children: [
              (0, t.jsxs)("div", {
                className:
                  "flex w-full items-center justify-between gap-2 rounded-[9px] border border-border bg-card p-1.5 pl-3",
                children: [
                  (0, t.jsx)("span", {
                    className:
                      "truncate min-w-0 flex-1 font-mono text-[12px] text-foreground select-all",
                    children: "npx shadcn@4.21.5 add @cavemio/button",
                  }),
                  (0, t.jsx)(s.CopyButton, {
                    text: "npx shadcn@4.21.5 add @cavemio/button",
                    variant: "ghost",
                    size: "sm",
                    className: "shrink-0",
                  }),
                ],
              }),
              (0, t.jsx)("span", {
                className:
                  "text-center text-[12px] text-muted-foreground max-w-[280px] leading-relaxed",
                children: "The icon blurs out and a check draws itself",
              }),
            ],
          });
});
