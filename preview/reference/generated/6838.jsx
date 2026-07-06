"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "./671000.jsx";
import * as dependency2 from "lucide-react";
import * as dependency3 from "../icon-factory";
import * as dependency4 from "../../../registry/components/command-palette";
("use strict");
var t = dependency0;
var a = dependency1;
var s = dependency2;
var l = dependency2;
var i = dependency2;
var o = dependency2;
var r = dependency2;
var c = dependency2;
var d = dependency2;
var n = dependency2;
var h = dependency2;
var y = dependency2;
let u = (0, dependency3.default)("UserPlus", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }],
]);
var p = dependency2;
var k = dependency4;
let x = (e) => new Promise((t) => window.setTimeout(t, e));
let m = [
  {
    id: "dashboard",
    group: "Go to",
    label: "Dashboard",
    icon: (0, t.jsx)(i.LayoutGrid, {}),
    shortcut: ["G", "D"],
    onSelect: () => {},
  },
  {
    id: "orders",
    group: "Go to",
    label: "Orders",
    icon: (0, t.jsx)(c.Package, {}),
    shortcut: ["G", "O"],
    description: "12 waiting",
    onSelect: () => {},
  },
  {
    id: "customers",
    group: "Go to",
    label: "Customers",
    icon: (0, t.jsx)(p.Users, {}),
    shortcut: ["G", "C"],
    onSelect: () => {},
  },
  {
    id: "reports",
    group: "Go to",
    label: "Reports",
    icon: (0, t.jsx)(a.BarChart3, {}),
    keywords: ["analytics", "sales"],
    onSelect: () => {},
  },
  {
    id: "new-order",
    group: "Actions",
    label: "New order",
    icon: (0, t.jsx)(n.Plus, {}),
    shortcut: ["⌘", "N"],
    onSelect: () => x(900),
  },
  {
    id: "invite",
    group: "Actions",
    label: "Invite a teammate",
    icon: (0, t.jsx)(u, {}),
    keywords: ["team", "member", "add"],
    onSelect: () => x(1100),
  },
  {
    id: "export",
    group: "Actions",
    label: "Export this week’s sales",
    icon: (0, t.jsx)(s.Download, {}),
    description: "CSV",
    keywords: ["download", "csv"],
    onSelect: () => x(1400),
  },
  {
    id: "theme",
    group: "Actions",
    label: "Change theme",
    icon: (0, t.jsx)(d.Palette, {}),
    keywords: ["dark", "light", "appearance"],
    items: [
      {
        id: "light",
        label: "Light",
        icon: (0, t.jsx)(y.Sun, {}),
        onSelect: () => x(500),
      },
      {
        id: "dark",
        label: "Dark",
        icon: (0, t.jsx)(o.Moon, {}),
        onSelect: () => x(500),
      },
      {
        id: "system",
        label: "Match my system",
        icon: (0, t.jsx)(r.Monitor, {}),
        onSelect: () => x(500),
      },
    ],
  },
  {
    id: "settings",
    group: "Settings",
    label: "Shop settings",
    icon: (0, t.jsx)(h.Settings, {}),
    shortcut: ["⌘", ","],
    onSelect: () => {},
  },
  {
    id: "docs",
    group: "Settings",
    label: "Keyboard shortcuts",
    icon: (0, t.jsx)(l.FileText, {}),
    shortcut: ["?"],
    onSelect: () => {},
  },
];
export default (function () {
  return (0, t.jsxs)("div", {
    className: "flex flex-col items-center gap-4",
    children: [
      (0, t.jsx)(k.CommandPalette, { triggerLabel: "Search\u2026", items: m }),
      (0, t.jsx)("p", {
        className: "text-center text-[12.5px] text-muted-foreground",
        children: "Click it, or press ⌘K anywhere on the page.",
      }),
    ],
  });
});
