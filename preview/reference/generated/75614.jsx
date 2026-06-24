"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency3 from "../icon-factory";
import * as dependency4 from "../../../registry/components/button";
("use strict");
var t = dependency0;
var s = dependency1;
var i = dependency2;
var r = dependency2;
var n = dependency2;
var a = dependency2;
let o = (0, dependency3.default)("RefreshCw", [
  [
    "path",
    { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" },
  ],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  [
    "path",
    { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" },
  ],
  ["path", { d: "M8 16H3v5", key: "1cv678" }],
]);
var l = dependency2;
var c = dependency4;
export default (function ({ tab: e = "Showcase" }) {
  let [d, x] = s.useState("idle"),
    [u, p] = s.useState("idle"),
    [h, m] = s.useState("idle"),
    [f, g] = s.useState("idle"),
    y = s.useRef(0),
    j = () => {
      "idle" === u && p("success");
    };
  return "Async state" === e
    ? (0, t.jsxs)("div", {
        className: "flex w-full max-w-[340px] flex-col gap-5 py-4 px-2",
        children: [
          (0, t.jsxs)("div", {
            className:
              "flex flex-col gap-2.5 rounded-[10px] border border-border bg-card p-3.5",
            children: [
              (0, t.jsxs)("div", {
                className: "flex items-center justify-between",
                children: [
                  (0, t.jsx)("span", {
                    className: "text-[12.5px] font-medium text-foreground",
                    children: "Project settings",
                  }),
                  (0, t.jsx)("span", {
                    className: "text-[11px] text-muted-foreground",
                    children: "Always succeeds",
                  }),
                ],
              }),
              (0, t.jsx)("p", {
                className: "text-[12px] text-muted-foreground leading-relaxed",
                children:
                  "Morphs into in-place spinner, eases container width, and draws self-drawing checkmark on completion.",
              }),
              (0, t.jsx)("div", {
                className: "flex justify-end pt-1",
                children: (0, t.jsx)(c.Button, {
                  variant: "primary",
                  size: "md",
                  status: h,
                  statusLabels: {
                    idle: "Save changes",
                    pending: "Saving changes",
                    success: "Changes saved",
                    error: "Try again",
                  },
                  onClick: () => {
                    "idle" === h &&
                      (m("pending"),
                      setTimeout(() => {
                        m("success");
                      }, 1100));
                  },
                  onReset: () => m("idle"),
                }),
              }),
            ],
          }),
          (0, t.jsxs)("div", {
            className:
              "flex flex-col gap-2.5 rounded-[10px] border border-border bg-card p-3.5",
            children: [
              (0, t.jsxs)("div", {
                className: "flex items-center justify-between",
                children: [
                  (0, t.jsx)("span", {
                    className: "text-[12.5px] font-medium text-foreground",
                    children: "Deployment pipeline",
                  }),
                  (0, t.jsx)("span", {
                    className: "text-[11px] text-muted-foreground",
                    children: "Fails on 1st click",
                  }),
                ],
              }),
              (0, t.jsx)("p", {
                className: "text-[12px] text-muted-foreground leading-relaxed",
                children:
                  "Fails initially: delivers tactile 380ms horizontal shake, alert icon, and red tone. Click again to recover.",
              }),
              (0, t.jsxs)("div", {
                className: "flex items-center justify-between pt-1",
                children: [
                  (0, t.jsx)(c.Button, {
                    variant: "ghost",
                    size: "sm",
                    icon: (0, t.jsx)(o, { size: 13 }),
                    onClick: () => {
                      ((y.current = 0), g("idle"));
                    },
                    children: "Reset",
                  }),
                  (0, t.jsx)(c.Button, {
                    variant: "secondary",
                    size: "md",
                    status: f,
                    statusLabels: {
                      idle: "Deploy build",
                      pending: "Building",
                      success: "Deployed live",
                      error: "Build failed",
                    },
                    onClick: () => {
                      if ("idle" !== f) return;
                      g("pending");
                      let e = y.current++ % 2 == 0;
                      setTimeout(() => {
                        g(e ? "error" : "success");
                      }, 1200);
                    },
                    onReset: () => g("idle"),
                  }),
                ],
              }),
            ],
          }),
        ],
      })
    : "Sizes" === e
      ? (0, t.jsxs)("div", {
          className:
            "flex flex-col items-center justify-center gap-6 py-6 w-full max-w-sm px-2",
          children: [
            (0, t.jsxs)("div", {
              className: "flex flex-wrap items-center justify-center gap-2.5",
              children: [
                (0, t.jsx)(c.Button, {
                  variant: "secondary",
                  size: "xs",
                  children: "Extra small",
                }),
                (0, t.jsx)(c.Button, {
                  variant: "secondary",
                  size: "sm",
                  children: "Small",
                }),
                (0, t.jsx)(c.Button, {
                  variant: "secondary",
                  size: "md",
                  children: "Medium",
                }),
                (0, t.jsx)(c.Button, {
                  variant: "secondary",
                  size: "lg",
                  children: "Large",
                }),
                (0, t.jsx)(c.Button, {
                  variant: "secondary",
                  size: "icon",
                  "aria-label": "More",
                  children: (0, t.jsx)(n.MoreHorizontal, { size: 15 }),
                }),
              ],
            }),
            (0, t.jsx)("span", {
              className: "text-center text-[12px] text-muted-foreground",
              children:
                "Concentric border radii calibrated to height (6px, 7px, 9px, 11px)",
            }),
          ],
        })
      : (0, t.jsxs)("div", {
          className:
            "flex w-full max-w-[350px] flex-col items-center gap-6 py-4 px-2",
          children: [
            (0, t.jsxs)("div", {
              className: "flex w-full flex-col items-center gap-2.5",
              children: [
                (0, t.jsx)("span", {
                  className:
                    "text-[11px] font-medium uppercase tracking-wider text-muted-foreground/75",
                  children: "Styles",
                }),
                (0, t.jsxs)("div", {
                  className:
                    "flex flex-wrap items-center justify-center gap-2 sm:gap-2.5",
                  children: [
                    (0, t.jsx)(c.Button, {
                      variant: "primary",
                      size: "md",
                      status: d,
                      statusLabels: {
                        idle: "Save changes",
                        pending: "Saving",
                        success: "Saved",
                        error: "Try again",
                      },
                      onClick: () => {
                        "idle" === d &&
                          (x("pending"),
                          setTimeout(() => {
                            x("success");
                          }, 1e3));
                      },
                      onReset: () => x("idle"),
                    }),
                    (0, t.jsx)(c.Button, {
                      variant: "secondary",
                      size: "md",
                      children: "Secondary",
                    }),
                    (0, t.jsx)(c.Button, {
                      variant: "ghost",
                      size: "md",
                      children: "Ghost",
                    }),
                  ],
                }),
                (0, t.jsx)("div", {
                  children: (0, t.jsx)(c.Button, {
                    variant: "destructive",
                    size: "sm",
                    children: "Delete",
                  }),
                }),
              ],
            }),
            (0, t.jsxs)("div", {
              className: "flex w-full flex-col items-center gap-2.5",
              children: [
                (0, t.jsx)("span", {
                  className:
                    "text-[11px] font-medium uppercase tracking-wider text-muted-foreground/75",
                  children: "Icons and sizes",
                }),
                (0, t.jsxs)("div", {
                  className:
                    "flex flex-wrap items-center justify-center gap-2 sm:gap-2.5",
                  children: [
                    (0, t.jsx)(c.Button, {
                      variant: "secondary",
                      size: "md",
                      icon: (0, t.jsx)(a.Plus, { size: 14 }),
                      children: "Add item",
                    }),
                    (0, t.jsx)(c.Button, {
                      variant: "primary",
                      size: "md",
                      trailingIcon: (0, t.jsx)(i.ArrowRight, { size: 14 }),
                      children: "Continue",
                    }),
                    (0, t.jsx)(c.Button, {
                      variant: "ghost",
                      size: "icon",
                      "aria-label": "More options",
                      children: (0, t.jsx)(n.MoreHorizontal, { size: 15 }),
                    }),
                  ],
                }),
                (0, t.jsx)("div", {
                  children: (0, t.jsx)(c.Button, {
                    variant: "secondary",
                    size: "lg",
                    children: "Large",
                  }),
                }),
              ],
            }),
            (0, t.jsxs)("div", {
              className: "flex w-full flex-col items-center gap-2.5",
              children: [
                (0, t.jsx)("span", {
                  className:
                    "text-[11px] font-medium uppercase tracking-wider text-muted-foreground/75",
                  children: "Feedback and states",
                }),
                (0, t.jsxs)("div", {
                  className:
                    "flex flex-wrap items-center justify-center gap-2 sm:gap-2.5",
                  children: [
                    (0, t.jsx)(c.Button, {
                      variant: "secondary",
                      size: "sm",
                      status: u,
                      statusLabels: { idle: "Copy link", success: "Copied" },
                      icon: (0, t.jsx)(r.Copy, { size: 13 }),
                      onClick: j,
                      onReset: () => p("idle"),
                    }),
                    (0, t.jsx)(c.Button, {
                      variant: "ghost",
                      size: "icon",
                      className: "size-7",
                      "aria-label": "Copy",
                      status: u,
                      icon: (0, t.jsx)(r.Copy, { size: 13 }),
                      onClick: j,
                      onReset: () => p("idle"),
                    }),
                    (0, t.jsx)(c.Button, {
                      variant: "secondary",
                      size: "sm",
                      icon: (0, t.jsx)(l.Upload, { size: 13 }),
                      children: "Upload file",
                    }),
                  ],
                }),
                (0, t.jsx)("div", {
                  children: (0, t.jsx)(c.Button, {
                    variant: "secondary",
                    size: "sm",
                    disabled: !0,
                    children: "Disabled",
                  }),
                }),
              ],
            }),
          ],
        });
});
