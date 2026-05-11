"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "./671000.jsx";
import * as dependency3 from "./227113.jsx";
import * as dependency4 from "lucide-react";
import * as dependency5 from "../icon-factory";
import * as dependency7 from "../../../registry/components/button-group";
import * as dependency8 from "../../../registry/components/number-roll";
("use strict");
var t = dependency0;
var i = dependency1;
var a = dependency2;
var l = dependency3;
var l = l;
var r = dependency4;
var s = dependency4;
var n = dependency5;
let o = (0, n.default)("Grid3x3", [
  [
    "rect",
    { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" },
  ],
  ["path", { d: "M3 9h18", key: "1pudct" }],
  ["path", { d: "M3 15h18", key: "5xshup" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }],
  ["path", { d: "M15 3v18", key: "14nvp0" }],
]);
let c = (0, n.default)("LayoutDashboard", [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
  [
    "rect",
    { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" },
  ],
  [
    "rect",
    { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" },
  ],
  [
    "rect",
    { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" },
  ],
]);
var d = dependency4;
var u = dependency4;
var x = dependency4;
let h = (0, n.default)("Save", [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476",
    },
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }],
]);
var p = dependency4;
function f(props) {
  return dependency1.createElement(dependency7.ButtonGroup, props);
}
var v = dependency8;
export default (function ({ tab: e = "Connected" }) {
  let [n, m] = i.useState("grid"),
    [y, g] = i.useState(100),
    [w, k] = i.useState("save"),
    [b, j] = i.useState("overview");
  return "Vertical" === e
    ? (0, t.jsxs)("div", {
        className:
          "flex w-full max-w-[320px] flex-col items-center justify-center gap-4 py-4",
        children: [
          (0, t.jsx)(f, {
            orientation: "vertical",
            size: "md",
            items: [
              {
                id: "overview",
                label: "Overview",
                icon: (0, t.jsx)(c, { size: 14 }),
                active: "overview" === b,
                onClick: () => j("overview"),
              },
              {
                id: "analytics",
                label: "Analytics",
                icon: (0, t.jsx)(a.BarChart3, { size: 14 }),
                active: "analytics" === b,
                onClick: () => j("analytics"),
              },
              {
                id: "reports",
                label: "Reports",
                icon: (0, t.jsx)(s.FileText, { size: 14 }),
                active: "reports" === b,
                onClick: () => j("reports"),
              },
              {
                id: "settings",
                label: "Settings",
                icon: (0, t.jsx)(p.Settings, { size: 14 }),
                active: "settings" === b,
                onClick: () => j("settings"),
              },
            ],
          }),
          (0, t.jsx)("span", {
            className: "text-center text-[12px] text-muted-foreground",
            children: "A vertical rail; arrow keys move between items",
          }),
        ],
      })
    : "Solid" === e
      ? (0, t.jsxs)("div", {
          className:
            "flex w-full max-w-[320px] flex-col items-center justify-center gap-6 py-4",
          children: [
            (0, t.jsx)(f, {
              variant: "solid",
              size: "md",
              items: [
                {
                  id: "grid",
                  label: "Grid view",
                  icon: (0, t.jsx)(o, { size: 14 }),
                  active: "grid" === n,
                  onClick: () => m("grid"),
                },
                {
                  id: "list",
                  label: "List view",
                  icon: (0, t.jsx)(d.List, { size: 14 }),
                  active: "list" === n,
                  onClick: () => m("list"),
                },
                {
                  id: "columns",
                  label: "Columns",
                  icon: (0, t.jsx)(l.default, { size: 14 }),
                  active: "columns" === n,
                  onClick: () => m("columns"),
                },
              ],
            }),
            (0, t.jsx)(f, {
              variant: "solid",
              size: "sm",
              items: [
                {
                  id: "save",
                  label: "Save draft",
                  icon: (0, t.jsx)(h, { size: 13 }),
                  active: "save" === w,
                  onClick: () => k("save"),
                },
                {
                  id: "preview",
                  label: "Preview",
                  icon: (0, t.jsx)(r.Eye, { size: 13 }),
                  active: "preview" === w,
                  onClick: () => k("preview"),
                },
              ],
            }),
            (0, t.jsx)("span", {
              className:
                "text-center text-[12px] text-muted-foreground max-w-[260px] leading-relaxed",
              children: "Solid, for the main choice on a toolbar",
            }),
          ],
        })
      : (0, t.jsxs)("div", {
          className:
            "flex w-full max-w-[340px] flex-col items-center justify-center gap-5 py-4",
          children: [
            (0, t.jsx)(f, {
              variant: "outline",
              size: "md",
              items: [
                {
                  id: "grid",
                  label: "Grid",
                  icon: (0, t.jsx)(o, { size: 14 }),
                  active: "grid" === n,
                  onClick: () => m("grid"),
                },
                {
                  id: "list",
                  label: "List",
                  icon: (0, t.jsx)(d.List, { size: 14 }),
                  active: "list" === n,
                  onClick: () => m("list"),
                },
                {
                  id: "columns",
                  label: "Columns",
                  icon: (0, t.jsx)(l.default, { size: 14 }),
                  active: "columns" === n,
                  onClick: () => m("columns"),
                },
              ],
            }),
            (0, t.jsx)(f, {
              variant: "outline",
              size: "sm",
              items: [
                {
                  id: "zoom-out",
                  label: "Zoom out",
                  icon: (0, t.jsx)(u.Minus, { size: 13 }),
                  iconOnly: !0,
                  onClick: () => g((e) => Math.max(50, e - 10)),
                },
                {
                  id: "zoom-val",
                  label: `${y}%`,
                  content: (0, t.jsx)(v.NumberRoll, {
                    value: y,
                    suffix: "%",
                    className:
                      "min-w-[38px] text-center text-[12px] tabular-nums text-foreground",
                  }),
                },
                {
                  id: "zoom-in",
                  label: "Zoom in",
                  icon: (0, t.jsx)(x.Plus, { size: 13 }),
                  iconOnly: !0,
                  onClick: () => g((e) => Math.min(200, e + 10)),
                },
              ],
            }),
            (0, t.jsx)(f, {
              variant: "solid",
              size: "md",
              items: [
                {
                  id: "save",
                  label: "Save",
                  icon: (0, t.jsx)(h, { size: 14 }),
                  active: "save" === w,
                  onClick: () => k("save"),
                },
                {
                  id: "preview",
                  label: "Preview",
                  icon: (0, t.jsx)(r.Eye, { size: 14 }),
                  active: "preview" === w,
                  onClick: () => k("preview"),
                },
              ],
            }),
            (0, t.jsx)("span", {
              className:
                "text-center text-[12px] text-muted-foreground max-w-[260px] leading-relaxed",
              children:
                "The fill is thrown to the segment you pick; labels fold into icons when the row runs out of room",
            }),
          ],
        });
});
