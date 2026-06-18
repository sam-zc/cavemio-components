"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../icon-factory";
import * as dependency3 from "lucide-react";
import * as dependency6 from "../../../registry/components/action-button";
("use strict");
var r = dependency0;
var t = dependency1;
let s = (0, dependency2.default)("CloudUpload", [
  ["path", { d: "M12 13v8", key: "1l5pq0" }],
  [
    "path",
    {
      d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242",
      key: "1pljnt",
    },
  ],
  ["path", { d: "m8 17 4-4 4 4", key: "1quai1" }],
]);
var n = dependency3;
function x(props) {
  return dependency1.createElement(dependency6.ActionButton, props);
}
export default (function ({ tab: e = "Async" }) {
  let [i, a] = t.useState("idle");
  return "Controlled" === e
    ? (0, r.jsxs)("div", {
        className:
          "flex w-full max-w-[340px] flex-col items-center justify-center gap-6 py-4 px-2",
        children: [
          (0, r.jsx)(x, {
            status: i,
            onReset: () => a("idle"),
            labels: {
              idle: "Deploy release",
              pending: "Deploying",
              success: "Deployed",
              error: "Deploy failed",
            },
            icon: (0, r.jsx)(s, { size: 14 }),
          }),
          (0, r.jsx)("div", {
            className: "flex flex-wrap items-center justify-center gap-1.5",
            children: ["idle", "pending", "success", "error"].map((e) =>
              (0, r.jsx)(
                "button",
                {
                  type: "button",
                  onClick: () => a(e),
                  className: `rounded-full px-2.5 py-1 text-[11px] font-mono transition-colors cursor-pointer ${i === e ? "bg-foreground text-background font-semibold" : "bg-muted text-muted-foreground hover:text-foreground"}`,
                  children: e,
                },
                e,
              ),
            ),
          }),
          (0, r.jsx)("span", {
            className: "text-center text-[12px] text-muted-foreground",
            children:
              "Controlled status with character glyph morphing and self-drawing checkmark",
          }),
        ],
      })
    : "Destructive" === e
      ? (0, r.jsxs)("div", {
          className:
            "flex w-full max-w-[340px] flex-col items-center justify-center gap-5 py-4 px-2",
          children: [
            (0, r.jsx)(x, {
              variant: "destructive",
              icon: (0, r.jsx)(n.Trash2, { size: 14 }),
              labels: {
                idle: "Purge cache",
                pending: "Purging",
                success: "Purged",
                error: "Failed to purge",
              },
              action: async () => {
                await new Promise((e) => setTimeout(e, 1200));
              },
            }),
            (0, r.jsx)("span", {
              className: "text-center text-[12px] text-muted-foreground",
              children:
                "Destructive affirmative transition with error shake physics",
            }),
          ],
        })
      : (0, r.jsxs)("div", {
          className:
            "flex w-full max-w-[340px] flex-col items-center justify-center gap-5 py-4 px-2",
          children: [
            (0, r.jsx)(x, {
              variant: "primary",
              icon: (0, r.jsx)(s, { size: 14 }),
              labels: {
                idle: "Save changes",
                pending: "Saving",
                success: "Saved",
                error: "Save failed",
              },
              action: async () => {
                await new Promise((e, r) => {
                  setTimeout(() => {
                    Math.random() > 0.15 ? e(!0) : r(Error("Failed"));
                  }, 1200);
                });
              },
            }),
            (0, r.jsx)("span", {
              className: "text-center text-[12px] text-muted-foreground",
              children:
                "Promise-driven action with in-place spinner, TextMorph, and auto-reset",
            }),
          ],
        });
});
