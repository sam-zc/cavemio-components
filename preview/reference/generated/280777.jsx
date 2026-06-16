"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "lucide-react";
import * as dependency2 from "../icon-factory";
import * as dependency3 from "react";
import * as dependency7 from "../../../registry/components/tooltip";
import * as dependency8 from "../../../registry/components/button";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency1;
var i = dependency1;
var o = dependency1;
let a = (0, dependency2.default)("Quote", [
  [
    "path",
    {
      d: "M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
      key: "rib7q0",
    },
  ],
  [
    "path",
    {
      d: "M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
      key: "1ymkrd",
    },
  ],
]);
var s = dependency1;
function m(props) {
  return dependency3.createElement(dependency7.Tooltip, props);
}
var h = dependency8;
let f = [
  { label: "Bold", key: "⌘B", icon: (0, t.jsx)(r.Bold, { size: 15 }) },
  { label: "Italic", key: "⌘I", icon: (0, t.jsx)(n.Italic, { size: 15 }) },
  {
    label: "Underline",
    key: "⌘U",
    icon: (0, t.jsx)(s.Underline, { size: 15 }),
  },
  { label: "Link", key: "⌘K", icon: (0, t.jsx)(i.Link2, { size: 15 }) },
  { label: "List", key: "⌘⇧8", icon: (0, t.jsx)(o.List, { size: 15 }) },
  { label: "Quote", key: "⌘⇧9", icon: (0, t.jsx)(a, { size: 15 }) },
];
export default (function ({ tab: e = "Toolbar" }) {
  return "Sides" === e
    ? (0, t.jsxs)("div", {
        className: "flex flex-col items-center gap-4",
        children: [
          (0, t.jsx)("div", {
            className: "grid grid-cols-2 gap-3",
            children: ["top", "right", "bottom", "left"].map((e) =>
              (0, t.jsx)(
                m,
                {
                  content: `On the ${e}`,
                  side: e,
                  children: (0, t.jsx)(h.Button, {
                    variant: "outline",
                    size: "sm",
                    children: e,
                  }),
                },
                e,
              ),
            ),
          }),
          (0, t.jsx)("p", {
            className: "text-[12px] text-muted-foreground",
            children: "Point at one, or Tab to it; touch has no hover",
          }),
        ],
      })
    : (0, t.jsxs)("div", {
        className: "flex flex-col items-center gap-4",
        children: [
          (0, t.jsx)("div", {
            role: "toolbar",
            "aria-label": "Formatting",
            className:
              "flex items-center gap-0.5 rounded-full bg-card p-1 shadow-[inset_0_0_0_1px_var(--border)]",
            children: f.map((e) =>
              (0, t.jsx)(
                m,
                {
                  content: e.label,
                  shortcut: e.key,
                  children: (0, t.jsx)(h.Button, {
                    variant: "ghost",
                    size: "icon",
                    "aria-label": e.label,
                    className: "size-8",
                    children: e.icon,
                  }),
                },
                e.label,
              ),
            ),
          }),
          (0, t.jsx)("p", {
            className: "text-[12px] text-muted-foreground",
            children: "Rest on one, then run along the bar",
          }),
        ],
      });
});
