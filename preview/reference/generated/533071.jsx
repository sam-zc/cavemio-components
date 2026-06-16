"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency3 from "../icon-factory";
import * as dependency5 from "../../../registry/components/tree-view";
import * as dependency6 from "../../../registry/components/text-morph";
import * as dependency7 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency2;
var a = dependency2;
var i = dependency2;
var l = dependency2;
var o = dependency3;
let s = (0, o.default)("FileJson", [
  [
    "path",
    {
      d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
      key: "1rqfz7",
    },
  ],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  [
    "path",
    {
      d: "M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1",
      key: "1oajmo",
    },
  ],
  [
    "path",
    {
      d: "M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1",
      key: "mpwhp6",
    },
  ],
]);
var d = dependency2;
var u = dependency2;
var c = dependency2;
let p = (0, o.default)("Map", [
  [
    "path",
    {
      d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",
      key: "169xi5",
    },
  ],
  ["path", { d: "M15 5.764v15", key: "1pn4in" }],
  ["path", { d: "M9 3.236v15", key: "1uimfh" }],
]);
var f = dependency2;
function C(props) {
  return dependency1.createElement(dependency5.TreeView, props);
}
var z = dependency6;
var E = dependency7;
let A = [
  { id: "roadmap", parent: null, title: "Roadmap", icon: "map" },
  { id: "q4", parent: "roadmap", title: "Q4 launch" },
  { id: "plan", parent: "q4", title: "Launch plan" },
  { id: "copy", parent: "q4", title: "Pricing page copy" },
  { id: "press", parent: "q4", title: "Press list" },
  { id: "q1", parent: "roadmap", title: "Q1 ideas" },
  { id: "specs", parent: null, title: "Specs" },
  { id: "billing", parent: "specs", title: "Billing v2" },
  { id: "seats", parent: "specs", title: "Seat-based pricing" },
  { id: "hooks", parent: "specs", title: "Webhook retries" },
  { id: "notes", parent: null, title: "Meeting notes", icon: "notes" },
  { id: "oct7", parent: "notes", title: "Oct 7 · Planning" },
  { id: "oct10", parent: "notes", title: "Oct 10 · Retro" },
  { id: "handbook", parent: null, title: "Team handbook", icon: "book" },
  { id: "archive", parent: null, title: "Archive", icon: "archive" },
  { id: "y2025", parent: "archive", title: "2025 planning" },
];
let F = [
  { id: "app", parent: null, title: "app" },
  { id: "marketing", parent: "app", title: "(marketing)" },
  { id: "m-page", parent: "marketing", title: "page.tsx", leaf: !0 },
  { id: "dashboard", parent: "app", title: "dashboard" },
  { id: "d-page", parent: "dashboard", title: "page.tsx", leaf: !0 },
  { id: "d-layout", parent: "dashboard", title: "layout.tsx", leaf: !0 },
  { id: "a-layout", parent: "app", title: "layout.tsx", leaf: !0 },
  { id: "css", parent: "app", title: "globals.css", leaf: !0 },
  { id: "components", parent: null, title: "components" },
  { id: "ui", parent: "components", title: "ui" },
  { id: "button", parent: "ui", title: "button.tsx", leaf: !0 },
  { id: "tree", parent: "ui", title: "tree-view.tsx", leaf: !0 },
  { id: "header", parent: "components", title: "site-header.tsx", leaf: !0 },
  { id: "lib", parent: null, title: "lib" },
  { id: "utils", parent: "lib", title: "utils.ts", leaf: !0 },
  { id: "pkg", parent: null, title: "package.json", leaf: !0 },
  { id: "readme", parent: null, title: "README.md", leaf: !0 },
];
let D = {
  map: (0, t.jsx)(p, { strokeWidth: 1.75 }),
  notes: (0, t.jsx)(f.NotebookPen, { strokeWidth: 1.75 }),
  book: (0, t.jsx)(a.BookOpen, { strokeWidth: 1.75 }),
  archive: (0, t.jsx)(n.Archive, { strokeWidth: 1.75 }),
};
let I = (e) =>
  e.icon ? D[e.icon] : (0, t.jsx)(d.FileText, { strokeWidth: 1.75 });
let L = (e, { expanded: r, hasChildren: n }) =>
  e.leaf
    ? e.title.endsWith(".json")
      ? (0, t.jsx)(s, { strokeWidth: 1.75 })
      : e.title.endsWith(".md")
        ? (0, t.jsx)(d.FileText, { strokeWidth: 1.75 })
        : (0, t.jsx)(l.FileCode, { strokeWidth: 1.75 })
    : r && n
      ? (0, t.jsx)(c.FolderOpen, { strokeWidth: 1.75 })
      : (0, t.jsx)(u.Folder, { strokeWidth: 1.75 });
let _ = (e) => new Promise((t) => setTimeout(t, e));
let H = 0;
let W = {
  Workspace:
    "Drag a page up, down, or sideways to nest it. Hold it over a closed page and it opens. F2 renames.",
  Files:
    "Files can’t hold others; folders open as you carry something over them.",
  Rules: "Archive is read-only, and Meeting notes only takes dated notes.",
  "Save fails": "The first move fails to save and goes back.",
};
function P({ name: e, sidebar: r, children: n, note: a }) {
  return (0, t.jsxs)("div", {
    style: (0, E.demoAppearance)(),
    className: "w-full max-w-[720px] text-foreground",
    children: [
      (0, t.jsx)("div", {
        className:
          "@container overflow-hidden rounded-[18px] border border-border bg-background",
        children: (0, t.jsxs)("div", {
          className: "flex",
          children: [
            (0, t.jsxs)("aside", {
              className:
                "flex w-[264px] shrink-0 flex-col border-r border-border p-2 @max-[34rem]:w-full @max-[34rem]:border-r-0",
              children: [
                (0, t.jsxs)("div", {
                  className:
                    "mb-1 flex h-9 items-center gap-2 rounded-[8px] px-2",
                  children: [
                    (0, t.jsx)("span", {
                      className:
                        "flex size-5 items-center justify-center rounded-[6px] bg-primary text-[10.5px] font-semibold text-primary-foreground",
                      children: "R",
                    }),
                    (0, t.jsx)("span", {
                      className: "text-[13.5px] font-medium tracking-[-0.01em]",
                      children: e,
                    }),
                    (0, t.jsx)(i.ChevronsUpDown, {
                      className: "ml-auto size-3.5 text-muted-foreground",
                      strokeWidth: 1.75,
                      "aria-hidden": "true",
                    }),
                  ],
                }),
                r,
              ],
            }),
            (0, t.jsx)("main", {
              className: "min-w-0 flex-1 px-7 py-6 @max-[34rem]:hidden",
              children: n,
            }),
          ],
        }),
      }),
      (0, t.jsx)("p", {
        className: "mt-2 px-1 text-[11.5px] text-muted-foreground",
        children: a,
      }),
    ],
  });
}
function q({ nodes: e, id: r }) {
  let n = [];
  for (
    let t = e.find((e) => e.id === r);
    t;
    t = e.find((e) => e.id === t.parent)
  )
    n.unshift(t);
  let a = n[n.length - 1];
  return (0, t.jsxs)(t.Fragment, {
    children: [
      (0, t.jsx)("p", {
        className: "truncate text-[12px] text-muted-foreground",
        children: (0, t.jsx)(z.TextMorph, {
          animateWidth: !1,
          children:
            n
              .slice(0, -1)
              .map((e) => e.title)
              .join(" / ") || "Relay",
        }),
      }),
      (0, t.jsx)("h3", {
        className: "mt-2 text-[22px] font-semibold tracking-[-0.02em]",
        children: (0, t.jsx)(z.TextMorph, {
          animateWidth: !1,
          children: a?.title ?? "Choose a page",
        }),
      }),
      (0, t.jsx)("div", {
        className: "mt-5 space-y-2.5",
        "aria-hidden": "true",
        children: [92, 100, 84, 96, 60].map((e, r) =>
          (0, t.jsx)(
            "div",
            {
              className: "h-2 rounded-full bg-muted",
              style: { width: `${e}%` },
            },
            r,
          ),
        ),
      }),
    ],
  });
}
function O({ tab: e }) {
  let [n, a] = r.default.useState(A),
    [i, l] = r.default.useState("plan"),
    o = r.default.useRef(!1);
  return (0, t.jsx)(P, {
    name: "Relay",
    note: W[e] ?? W.Workspace,
    sidebar: (0, t.jsx)(C, {
      className: "h-[340px]",
      label: "Relay pages",
      nodes: n,
      onNodesChange: a,
      defaultExpanded: ["roadmap", "q4"],
      selected: i,
      onSelect: (e) => l(e.id),
      icon: I,
      canDrop:
        "Rules" === e
          ? (e, t) =>
              t?.id === "archive"
                ? "Archive is read-only"
                : t?.id !== "notes" || /^[A-Z][a-z]{2} \d/.test(e.title)
                  ? null
                  : "Meeting notes only takes dated notes"
          : void 0,
      onMove: async () => {
        if ((await _(500), "Save fails" === e && !o.current))
          throw ((o.current = !0), Error("Offline"));
      },
      onRename: () => _(300),
      onCreate: async (e, t) => (
        await _(250),
        { id: `new-${H++}`, parent: e?.id ?? null, title: t }
      ),
      onDelete: () => _(300),
    }),
    children: (0, t.jsx)(q, { nodes: n, id: i }),
  });
}
function Y() {
  let [e, n] = r.default.useState(F),
    [a, i] = r.default.useState("tree");
  return (0, t.jsx)(P, {
    name: "relay-web",
    note: W.Files,
    sidebar: (0, t.jsx)(C, {
      className: "h-[340px]",
      label: "Files",
      nodes: e,
      onNodesChange: n,
      defaultExpanded: ["app", "components", "ui"],
      selected: a,
      onSelect: (e) => i(e.id),
      icon: L,
      indent: 12,
      addLabel: "file",
      onMove: () => _(300),
      onRename: () => _(200),
      onCreate: async (e, t) => ({
        id: `file-${H++}`,
        parent: e?.id ?? null,
        title: t,
        leaf: t.includes("."),
      }),
      onDelete: () => _(200),
    }),
    children: (0, t.jsx)(q, { nodes: e, id: a }),
  });
}
export default (function ({ tab: e = "Workspace" }) {
  return "Files" === e ? (0, t.jsx)(Y, {}) : (0, t.jsx)(O, { tab: e }, e);
});
