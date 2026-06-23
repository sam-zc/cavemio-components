"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency5 from "../../../registry/components/badge";
import * as dependency6 from "../../../registry/components/button";
("use strict");
var r = dependency0;
var t = dependency1;
function d(props) {
  return dependency1.createElement(dependency5.Badge, props);
}
var c = dependency6;
let x = [
  { word: "Queued", tone: "neutral" },
  { word: "Building", tone: "primary" },
  { word: "Ready", tone: "success" },
];
export default (function ({ tab: e = "Status" }) {
  let [n, i] = t.useState(0),
    [s, a] = t.useState(3);
  if ("Counts" === e)
    return (0, r.jsxs)("div", {
      className: "flex flex-col items-center gap-5",
      children: [
        (0, r.jsxs)("div", {
          className: "flex items-center gap-6 text-[13.5px] text-foreground",
          children: [
            (0, r.jsxs)("span", {
              className: "flex items-center gap-2",
              children: [
                "Inbox ",
                (0, r.jsx)(d, { tone: "primary", size: "sm", count: s }),
              ],
            }),
            (0, r.jsxs)("span", {
              className: "flex items-center gap-2",
              children: [
                "Mentions ",
                (0, r.jsx)(d, { size: "sm", count: 37 * s }),
              ],
            }),
          ],
        }),
        (0, r.jsxs)("div", {
          className: "flex gap-2",
          children: [
            (0, r.jsx)(c.Button, {
              variant: "outline",
              size: "sm",
              onClick: () => a((e) => e + 1),
              children: "New message",
            }),
            (0, r.jsx)(c.Button, {
              variant: "ghost",
              size: "sm",
              onClick: () => a(0),
              children: "Mark all read",
            }),
          ],
        }),
      ],
    });
  let o = x[n];
  return (0, r.jsxs)("div", {
    className: "flex flex-col items-center gap-5",
    children: [
      (0, r.jsxs)("div", {
        className:
          "flex w-[280px] items-center justify-between rounded-[14px] bg-card px-4 py-3 shadow-[inset_0_0_0_1px_var(--border)]",
        children: [
          (0, r.jsxs)("div", {
            className: "flex flex-col",
            children: [
              (0, r.jsx)("span", {
                className: "text-[13.5px] font-medium text-foreground",
                children: "relay-web",
              }),
              (0, r.jsx)("span", {
                className: "text-[12px] text-muted-foreground",
                children: "main · 4f2a91c",
              }),
            ],
          }),
          (0, r.jsx)(d, {
            tone: o.tone,
            dot: "Building" !== o.word || "pulse",
            children: o.word,
          }),
        ],
      }),
      (0, r.jsxs)("div", {
        className: "flex flex-wrap justify-center gap-2",
        children: [
          (0, r.jsx)(d, { outline: !0, children: "Template" }),
          (0, r.jsx)(d, {
            outline: !0,
            tone: "primary",
            children: "All access",
          }),
          (0, r.jsx)(d, { tone: "warning", children: "Expires soon" }),
          (0, r.jsx)(d, { tone: "danger", children: "Overdue" }),
        ],
      }),
      (0, r.jsx)(c.Button, {
        variant: "outline",
        size: "sm",
        onClick: () => i((e) => (e + 1) % x.length),
        children: "Next status",
      }),
    ],
  });
});
