"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency3 from "../icon-factory";
import * as dependency6 from "../../../registry/components/split-button";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency2;
var i = dependency2;
let a = (0, dependency3.default)("Send", [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3",
    },
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }],
]);
var o = dependency2;
var s = dependency2;
var l = dependency2;
function f(props) {
  return dependency1.createElement(dependency6.SplitButton, props);
}
export default (function ({ tab: e = "Primary" }) {
  let [d, c] = r.useState("Ready"),
    [u, p] = r.useState(!1);
  return "Destructive" === e
    ? (0, t.jsxs)("div", {
        className:
          "flex w-full max-w-[340px] flex-col items-center justify-center gap-5 py-4 px-2",
        children: [
          (0, t.jsx)(f, {
            variant: "destructive",
            label: "Delete branch",
            icon: (0, t.jsx)(l.Trash2, { size: 14 }),
            onClick: () => c("Deleted branch"),
            menuItems: [
              {
                id: "force-delete",
                label: "Force delete branch",
                destructive: !0,
                onSelect: () => c("Force deleted branch"),
              },
              {
                id: "archive",
                label: "Archive branch instead",
                onSelect: () => c("Archived branch"),
              },
            ],
          }),
          (0, t.jsx)("span", {
            className:
              "text-center text-[12px] tabular-nums text-muted-foreground",
            children: d,
          }),
        ],
      })
    : "Secondary" === e
      ? (0, t.jsxs)("div", {
          className:
            "flex w-full max-w-[340px] flex-col items-center justify-center gap-5 py-4 px-2",
          children: [
            (0, t.jsx)(f, {
              variant: "secondary",
              label: "Export document",
              icon: (0, t.jsx)(n.Download, { size: 14 }),
              onClick: () => c("Exported as PDF"),
              menuItems: [
                {
                  id: "pdf",
                  label: "Export as PDF (.pdf)",
                  icon: (0, t.jsx)(i.FileText, { size: 13 }),
                  onSelect: () => c("Exported as PDF"),
                },
                {
                  id: "markdown",
                  label: "Export as Markdown (.md)",
                  onSelect: () => c("Exported as Markdown"),
                },
                {
                  id: "share",
                  label: "Copy share link",
                  icon: (0, t.jsx)(o.Share2, { size: 13 }),
                  onSelect: () => c("Copied share link"),
                },
              ],
            }),
            (0, t.jsx)("span", {
              className:
                "text-center text-[12px] tabular-nums text-muted-foreground",
              children: d,
            }),
          ],
        })
      : (0, t.jsxs)("div", {
          className:
            "flex w-full max-w-[340px] flex-col items-center justify-center gap-5 py-4 px-2",
          children: [
            (0, t.jsx)(f, {
              variant: "primary",
              label: u ? "Publishing" : "Publish",
              loading: u,
              icon: (0, t.jsx)(s.Sparkles, { size: 14 }),
              onClick: () => {
                (p(!0),
                  c("Publishing"),
                  setTimeout(() => {
                    (p(!1), c("Published to production"));
                  }, 1e3));
              },
              menuItems: [
                {
                  id: "schedule",
                  label: "Schedule for later",
                  icon: (0, t.jsx)(a, { size: 13 }),
                  onSelect: () => c("Scheduled for later"),
                },
                {
                  id: "draft",
                  label: "Save as draft",
                  onSelect: () => c("Saved as draft"),
                },
                {
                  id: "preview",
                  label: "Open staging preview",
                  onSelect: () => c("Staging preview opened"),
                },
              ],
            }),
            (0, t.jsx)("span", {
              className:
                "text-center text-[12px] tabular-nums text-muted-foreground",
              children: d,
            }),
          ],
        });
});
