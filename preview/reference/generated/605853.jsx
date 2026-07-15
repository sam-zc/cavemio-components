"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency3 from "../icon-factory";
import * as dependency6 from "../../../registry/components/expanding-button-group";
("use strict");
var t = dependency0;
var i = dependency1;
var n = dependency2;
var l = dependency2;
var r = dependency2;
let a = (0, dependency3.default)("History", [
  [
    "path",
    { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" },
  ],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }],
]);
var s = dependency2;
var o = dependency2;
var d = dependency2;
var c = dependency2;
var u = dependency2;
function h(props) {
  return dependency1.createElement(dependency6.ExpandingButtonGroup, props);
}
export default (function ({ tab: e = "Toolbar" }) {
  let [p, x] = i.useState("Point at, tab to or tap any icon");
  return "Tones" === e
    ? (0, t.jsxs)("div", {
        className:
          "flex w-full max-w-[340px] flex-col items-center justify-center gap-6 py-4 px-2",
        children: [
          (0, t.jsx)(h, {
            defaultExpandedId: "publish",
            items: [
              {
                id: "publish",
                label: "Publish",
                icon: (0, t.jsx)(r.Globe, { size: 14 }),
                tone: "primary",
                onClick: () => x("Triggered Publish (primary tone)"),
              },
              {
                id: "pin",
                label: "Pin to top",
                icon: (0, t.jsx)(o.Pin, { size: 14 }),
                tone: "default",
                onClick: () => x("Triggered Pin (neutral tone)"),
              },
              {
                id: "delete",
                label: "Delete",
                icon: (0, t.jsx)(c.Trash2, { size: 14 }),
                tone: "danger",
                confirm: "Delete?",
                onClick: () => x("Triggered Delete (danger tone)"),
              },
            ],
          }),
          (0, t.jsx)("span", {
            className:
              "text-center text-[12px] tabular-nums text-muted-foreground",
            children: p,
          }),
        ],
      })
    : "Confirm" === e
      ? (0, t.jsxs)("div", {
          className:
            "flex w-full max-w-[340px] flex-col items-center justify-center gap-6 py-4 px-2",
          children: [
            (0, t.jsx)(h, {
              items: [
                {
                  id: "download",
                  label: "Download",
                  confirmLabel: "Saved",
                  icon: (0, t.jsx)(l.Download, { size: 14 }),
                  onClick: () => x("Downloaded asset to files"),
                },
                {
                  id: "link",
                  label: "Copy link",
                  confirmLabel: "Copied",
                  icon: (0, t.jsx)(s.Link2, { size: 14 }),
                  onClick: () => x("Link copied to clipboard"),
                },
                {
                  id: "archive",
                  label: "Archive",
                  confirmLabel: "Archived",
                  icon: (0, t.jsx)(n.Archive, { size: 14 }),
                  tone: "danger",
                  onClick: () => x("Item archived safely"),
                },
              ],
            }),
            (0, t.jsx)("span", {
              className:
                "text-center text-[12px] tabular-nums text-muted-foreground",
              children: p,
            }),
          ],
        })
      : (0, t.jsxs)("div", {
          className:
            "flex w-full max-w-[360px] flex-col items-center justify-center gap-6 py-4 px-2",
          children: [
            (0, t.jsx)(h, {
              items: [
                {
                  id: "undo",
                  label: "Undo",
                  icon: (0, t.jsx)(u.Undo2, { size: 14 }),
                  onClick: () => x("Undo action"),
                },
                {
                  id: "redo",
                  label: "Redo",
                  icon: (0, t.jsx)(d.Redo2, { size: 14 }),
                  onClick: () => x("Redo action"),
                },
                {
                  id: "archive",
                  label: "Archive",
                  icon: (0, t.jsx)(n.Archive, { size: 14 }),
                  onClick: () => x("Archive note"),
                },
                {
                  id: "history",
                  label: "History",
                  icon: (0, t.jsx)(a, { size: 14 }),
                  onClick: () => x("Version history"),
                },
                {
                  id: "delete",
                  label: "Delete",
                  icon: (0, t.jsx)(c.Trash2, { size: 14 }),
                  tone: "danger",
                  confirm: "Delete?",
                  confirmLabel: "Deleted",
                  onClick: () => x("Note deleted"),
                },
              ],
            }),
            (0, t.jsx)("span", {
              className:
                "text-center text-[12px] tabular-nums text-muted-foreground",
              children: p,
            }),
          ],
        });
});
