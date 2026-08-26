"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency6 from "../../../registry/components/task-progress";
("use strict");
var t = dependency0;
var n = dependency1;
function w(props) {
  return dependency1.createElement(dependency6.TaskProgress, props);
}
let b = ["Searching", "Reading", "Writing"];
export default (function ({ tab: e = "Live" }) {
  let [r] = (0, n.useState)(() => Date.now() - 62e3),
    [s, i] = (0, n.useState)(
      "Done" === e ? 2 : +("Error" === e || "Cancelled" === e),
    ),
    [a, l] = (0, n.useState)("Live" === e ? 8 : 42),
    [o, d] = (0, n.useState)(12 * ("Live" !== e)),
    [c, u] = (0, n.useState)(
      "Done" === e
        ? "done"
        : "Error" === e
          ? "error"
          : "Cancelled" === e
            ? "cancelled"
            : "running",
    );
  return (
    (0, n.useEffect)(() => {
      if ("Live" !== e) return;
      let t = [
        window.setTimeout(() => l(23), 700),
        window.setTimeout(() => l(42), 1500),
        window.setTimeout(() => i(1), 2200),
        window.setTimeout(() => d(5), 2900),
        window.setTimeout(() => d(12), 3700),
        window.setTimeout(() => i(2), 4600),
        window.setTimeout(() => u("done"), 7e3),
      ];
      return () => t.forEach((e) => window.clearTimeout(e));
    }, [e]),
    (0, t.jsx)("div", {
      className: "w-full max-w-[440px]",
      children: (0, t.jsx)(w, {
        title: "Researching waffle cone suppliers",
        status: c,
        phases: b,
        phase: s,
        startedAt: r,
        duration: "Done" === e ? 252e3 : void 0,
        stats: [
          { label: "sources", value: a },
          { label: "read", value: o },
        ],
        message: "You can close this tab. We’ll keep going and let you know.",
        onCancel: () => u("cancelled"),
        onOpen: () => {},
        openLabel: "Open report",
        errorText: "Three supplier sites blocked automated reading.",
        onRetry: () => u("running"),
      }),
    })
  );
});
