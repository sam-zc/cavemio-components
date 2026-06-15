"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "lucide-react";
import * as dependency2 from "../icon-factory";
import * as dependency3 from "react";
import * as dependency5 from "../../../registry/components/toggle-group";
("use strict");
var t = dependency0;
var i = dependency1;
var a = dependency2;
let l = (0, a.default)("Code", [
  ["polyline", { points: "16 18 22 12 16 6", key: "z7tu5w" }],
  ["polyline", { points: "8 6 2 12 8 18", key: "1eg1df" }],
]);
var n = dependency1;
let r = (0, a.default)("Strikethrough", [
  ["path", { d: "M16 4H9a3 3 0 0 0-2.83 4", key: "43sutm" }],
  ["path", { d: "M14 12a4 4 0 0 1 0 8H6", key: "nlfj13" }],
  ["line", { x1: "4", x2: "20", y1: "12", y2: "12", key: "1e0a9i" }],
]);
var s = dependency1;
function u(props) {
  return dependency3.createElement(dependency5.ToggleGroup, props);
}
function c(props) {
  return dependency3.createElement(dependency5.Toggle, props);
}
export default (function ({ tab: e = "Formatting" }) {
  return "Filters" === e
    ? (0, t.jsxs)("div", {
        className: "flex flex-col items-center gap-4",
        children: [
          (0, t.jsx)(u, {
            label: "Days",
            size: "sm",
            defaultValue: ["mon", "tue", "wed"],
            options: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (e) => ({ value: e.toLowerCase(), label: e }),
            ),
          }),
          (0, t.jsx)("p", {
            className: "text-[12px] text-muted-foreground",
            children: "Days next to each other join up",
          }),
        ],
      })
    : (0, t.jsxs)("div", {
        className: "flex items-center gap-3",
        children: [
          (0, t.jsx)(u, {
            label: "Formatting",
            defaultValue: ["bold", "italic"],
            options: [
              {
                value: "bold",
                label: "Bold",
                icon: (0, t.jsx)(i.Bold, {}),
                iconOnly: !0,
              },
              {
                value: "italic",
                label: "Italic",
                icon: (0, t.jsx)(n.Italic, {}),
                iconOnly: !0,
              },
              {
                value: "underline",
                label: "Underline",
                icon: (0, t.jsx)(s.Underline, {}),
                iconOnly: !0,
              },
              {
                value: "strike",
                label: "Strikethrough",
                icon: (0, t.jsx)(r, {}),
                iconOnly: !0,
              },
            ],
          }),
          (0, t.jsx)(c, { "aria-label": "Code", children: (0, t.jsx)(l, {}) }),
        ],
      });
});
