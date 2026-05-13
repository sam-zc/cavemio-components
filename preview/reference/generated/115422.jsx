"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency3 from "../icon-factory";
import * as dependency8 from "../../../registry/components/context-menu";
("use strict");
var t = dependency0;
var n = dependency1;
var r = dependency2;
var o = dependency2;
let i = (0, dependency3.default)("FolderInput", [
  [
    "path",
    {
      d: "M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1",
      key: "fm4g5t",
    },
  ],
  ["path", { d: "M2 13h10", key: "pgb2dq" }],
  ["path", { d: "m9 16 3-3-3-3", key: "6m91ic" }],
]);
var s = dependency2;
var a = dependency2;
var l = dependency2;
function m(props) {
  return dependency1.createElement(dependency8.ContextMenu, props);
}
let p = ["Brief.pdf", "Pricing.key", "Logo.svg"];
export default (function () {
  let [e, c] = n.useState("Right-click a file, or press and hold"),
    [u, d] = n.useState(["Logo.svg"]);
  return (0, t.jsxs)("div", {
    className: "flex flex-col items-center gap-4",
    children: [
      (0, t.jsx)("div", {
        className: "flex gap-3",
        children: p.map((e) =>
          (0, t.jsx)(
            m,
            {
              label: `${e} actions`,
              className: "rounded-[14px]",
              items: [
                {
                  id: "rename",
                  label: "Rename",
                  icon: (0, t.jsx)(s.Pencil, {}),
                  onSelect: () => c(`Renaming ${e}`),
                },
                {
                  id: "move",
                  label: "Move to…",
                  icon: (0, t.jsx)(i, {}),
                  onSelect: () => c(`Moving ${e}`),
                },
                {
                  id: "download",
                  label: "Download",
                  icon: (0, t.jsx)(r.Download, {}),
                  shortcut: "⌘S",
                  onSelect: () => c(`Downloading ${e}`),
                },
                {
                  type: "checkbox",
                  id: "star",
                  label: "Starred",
                  icon: (0, t.jsx)(a.Star, {}),
                  checked: u.includes(e),
                  onCheckedChange: (t) =>
                    d(t ? [...u, e] : u.filter((t) => t !== e)),
                },
                { type: "separator" },
                {
                  id: "delete",
                  label: "Delete",
                  icon: (0, t.jsx)(l.Trash2, {}),
                  destructive: !0,
                  onSelect: () => c(`${e} moved to bin`),
                },
              ],
              children: (0, t.jsxs)("div", {
                className:
                  "flex w-[88px] select-none flex-col items-center gap-2 rounded-[14px] bg-card p-3 shadow-[inset_0_0_0_1px_var(--border)]",
                children: [
                  (0, t.jsx)(o.FileText, {
                    size: 22,
                    className: "text-muted-foreground",
                    strokeWidth: 1.5,
                  }),
                  (0, t.jsxs)("span", {
                    className:
                      "w-full truncate text-center text-[12px] text-foreground",
                    children: [u.includes(e) ? "★ " : "", e],
                  }),
                ],
              }),
            },
            e,
          ),
        ),
      }),
      (0, t.jsx)("p", {
        className: "text-[12px] text-muted-foreground",
        children: e,
      }),
    ],
  });
});
