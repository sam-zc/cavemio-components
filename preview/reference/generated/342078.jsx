"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/switch";
("use strict");
var t = dependency0;
var s = dependency1;
var a = dependency2;
export default (function ({ tab: e = "Settings" }) {
  let n = s.useRef(!1);
  return "Sizes" === e
    ? (0, t.jsxs)("div", {
        className: "flex items-center gap-4",
        children: [
          (0, t.jsx)(a.Switch, {
            size: "sm",
            "aria-label": "Compact",
            defaultChecked: !0,
          }),
          (0, t.jsx)(a.Switch, { "aria-label": "Default", defaultChecked: !0 }),
        ],
      })
    : "Async" === e
      ? (0, t.jsx)("div", {
          className: "flex w-full max-w-[320px] flex-col gap-4",
          children: (0, t.jsx)(a.Switch, {
            label: "Public link",
            description:
              "Saving takes a second; every other save fails and the switch goes back.",
            labelPosition: "start",
            onCheckedChange: () =>
              new Promise((e, t) =>
                window.setTimeout(() => {
                  let s = n.current;
                  ((n.current = !n.current), s ? t(Error("offline")) : e(null));
                }, 1100),
              ),
          }),
        })
      : (0, t.jsxs)("div", {
          className: "flex w-full max-w-[320px] flex-col gap-4",
          children: [
            (0, t.jsx)(a.Switch, {
              label: "Weekly digest",
              description: "A summary every Monday.",
              labelPosition: "start",
              defaultChecked: !0,
            }),
            (0, t.jsx)(a.Switch, {
              label: "Mentions",
              description: "When someone @-mentions you.",
              labelPosition: "start",
            }),
          ],
        });
});
