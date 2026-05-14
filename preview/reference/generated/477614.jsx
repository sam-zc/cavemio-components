"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency7 from "../../../registry/components/dropdown-menu";
import * as dependency8 from "../../../registry/components/button";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency2;
var i = dependency2;
var s = dependency2;
var o = dependency2;
var a = dependency2;
var c = dependency2;
function h(props) {
  return dependency1.createElement(dependency7.DropdownMenu, props);
}
var f = dependency8;
export default (function ({ tab: e = "Actions" }) {
  let [l, d] = r.useState("Open the menu"),
    [u, p] = r.useState({ owner: !0, status: !0, updated: !1 });
  return "View options" === e
    ? (0, t.jsxs)("div", {
        className: "flex flex-col items-center gap-4",
        children: [
          (0, t.jsx)(h, {
            trigger: (0, t.jsx)(f.Button, {
              variant: "outline",
              size: "sm",
              icon: (0, t.jsx)(i.Eye, { size: 13 }),
              children: "View",
            }),
            items: [
              { type: "label", label: "Columns" },
              {
                type: "checkbox",
                id: "owner",
                label: "Owner",
                checked: u.owner,
                onCheckedChange: (e) => p({ ...u, owner: e }),
              },
              {
                type: "checkbox",
                id: "status",
                label: "Status",
                checked: u.status,
                onCheckedChange: (e) => p({ ...u, status: e }),
              },
              {
                type: "checkbox",
                id: "updated",
                label: "Last updated",
                checked: u.updated,
                onCheckedChange: (e) => p({ ...u, updated: e }),
              },
            ],
          }),
          (0, t.jsxs)("p", {
            className: "text-[12px] text-muted-foreground",
            children: [
              "Showing ",
              Object.entries(u)
                .filter(([, e]) => e)
                .map(([e]) => e)
                .join(", ") || "no columns",
            ],
          }),
        ],
      })
    : (0, t.jsxs)("div", {
        className: "flex flex-col items-center gap-4",
        children: [
          (0, t.jsxs)("div", {
            className:
              "flex w-[280px] items-center justify-between rounded-[14px] bg-card py-2 pl-4 pr-2 shadow-[inset_0_0_0_1px_var(--border)]",
            children: [
              (0, t.jsxs)("div", {
                className: "flex flex-col",
                children: [
                  (0, t.jsx)("span", {
                    className: "text-[13.5px] font-medium text-foreground",
                    children: "Northwind pitch.pdf",
                  }),
                  (0, t.jsx)("span", {
                    className: "text-[12px] text-muted-foreground",
                    children: "2.4 MB · Edited today",
                  }),
                ],
              }),
              (0, t.jsx)(h, {
                align: "end",
                trigger: (0, t.jsx)(f.Button, {
                  variant: "ghost",
                  size: "icon",
                  "aria-label": "File actions",
                  className: "size-8",
                  children: (0, t.jsx)(s.MoreHorizontal, { size: 15 }),
                }),
                items: [
                  {
                    id: "rename",
                    label: "Rename",
                    icon: (0, t.jsx)(o.Pencil, {}),
                    shortcut: "F2",
                    onSelect: () => d("Renaming"),
                  },
                  {
                    id: "copy",
                    label: "Duplicate",
                    icon: (0, t.jsx)(n.Copy, {}),
                    shortcut: "⌘D",
                    onSelect: () => d("Duplicated"),
                  },
                  {
                    id: "share",
                    label: "Share",
                    icon: (0, t.jsx)(a.Share2, {}),
                    onSelect: () => d("Share link copied"),
                  },
                  { type: "separator" },
                  {
                    id: "delete",
                    label: "Delete",
                    icon: (0, t.jsx)(c.Trash2, {}),
                    destructive: !0,
                    onSelect: () => d("Moved to bin"),
                  },
                ],
              }),
            ],
          }),
          (0, t.jsx)("p", {
            className: "text-[12px] text-muted-foreground",
            children: l,
          }),
        ],
      });
});
