"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/plan";
("use strict");
var s = dependency0;
var t = dependency1;
function h(props) {
  return dependency1.createElement(dependency4.Plan, props);
}
let x = [
  "Pull last month’s sales by flavor",
  "Compare margins against vanilla",
  "Check cone and cup inventory",
  "Draft the weekend special",
  "Write the announcement",
];
export default (function ({ tab: e = "Live" }) {
  let n = "Failed" === e ? 2 : void 0,
    [a, r] = (0, t.useState)("Settled" === e ? x.length : 0);
  return (
    (0, t.useEffect)(() => {
      if ("Settled" === e) return;
      let s = Array.from({ length: void 0 !== n ? n + 1 : x.length }, (e, s) =>
        window.setTimeout(() => r(s + 1), 900 + 1e3 * s),
      );
      return () => s.forEach((e) => window.clearTimeout(e));
    }, [e, n]),
    (0, s.jsx)("div", {
      className: "w-full max-w-[400px]",
      children: (0, s.jsx)(h, {
        title: "Weekend special",
        tasks: x.map((e, s) =>
          void 0 !== n && s === n && a > s
            ? {
                label: e,
                status: "failed",
                detail: "The inventory sheet is locked by another user.",
              }
            : void 0 !== n && s > n && a > n
              ? { label: e, status: s === n + 1 ? "skipped" : "pending" }
              : s < a
                ? {
                    label: e,
                    status: "done",
                    detail: 1 === s ? "Pistachio leads at 41% margin." : void 0,
                  }
                : s === a
                  ? { label: e, status: "running" }
                  : { label: e, status: "pending" },
        ),
        defaultOpen: "Settled" !== e,
      }),
    })
  );
});
