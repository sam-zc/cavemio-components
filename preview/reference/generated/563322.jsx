"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../icon-factory";
import * as dependency3 from "../../../registry/components/tool-call";
("use strict");
var t = dependency0;
var r = dependency1;
let n = (0, dependency2.default)("Plane", [
  [
    "path",
    {
      d: "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z",
      key: "1v9wt8",
    },
  ],
]);
var s = dependency3;
let i = { from: "BLR", to: "LIS", date: "2026-11-02", passengers: 2 };
let a = {
  cheapest: "€412",
  airline: "TAP Air Portugal",
  stops: 1,
  duration: "14h 20m",
};
export default (function ({ tab: e = "Live" }) {
  let [o, l] = (0, r.useState)(
      "Denied" === e ? "denied" : "Custom output" === e ? "done" : "preparing",
    ),
    [d, u] = (0, r.useState)(4 * ("Live" !== e && "Error" !== e)),
    [c, m] = (0, r.useState)(0);
  (0, r.useEffect)(() => {
    if ("Live" !== e && "Error" !== e) return;
    (l("preparing"), u(0));
    let t = [1, 2, 3, 4].map((e) => window.setTimeout(() => u(e), 350 * e));
    return (
      t.push(window.setTimeout(() => l("running"), 1700)),
      t.push(
        window.setTimeout(() => l("Error" === e ? "error" : "done"), 3100),
      ),
      () => t.forEach((e) => window.clearTimeout(e))
    );
  }, [e, c]);
  let x = Object.fromEntries(Object.entries(i).slice(0, d));
  return (0, t.jsx)("div", {
    className: "w-full max-w-[420px]",
    children: (0, t.jsx)(s.ToolCall, {
      name: "search_flights",
      title: "Search flights",
      icon: (0, t.jsx)(n, { className: "size-3.5" }),
      status: o,
      input: x,
      output: a,
      duration: 1240,
      defaultOpen: !0,
      errorText: "The flights API timed out after 10 seconds.",
      onRetry: () => m((e) => e + 1),
      renderOutput:
        "Custom output" === e
          ? () =>
              (0, t.jsxs)("div", {
                className:
                  "flex items-center justify-between rounded-lg border border-border px-3 py-2.5",
                children: [
                  (0, t.jsxs)("div", {
                    children: [
                      (0, t.jsx)("p", {
                        className: "text-[13px] font-medium text-foreground",
                        children: "Bengaluru → Lisbon",
                      }),
                      (0, t.jsx)("p", {
                        className: "text-[12px] text-muted-foreground",
                        children: "TAP Air Portugal · 1 stop · 14h 20m",
                      }),
                    ],
                  }),
                  (0, t.jsx)("p", {
                    className:
                      "text-[15px] font-medium tabular-nums text-foreground",
                    children: "€412",
                  }),
                ],
              })
          : void 0,
    }),
  });
});
