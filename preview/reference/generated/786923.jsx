"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/thinking-indicator";
("use strict");
var n = dependency0;
var t = dependency1;
function p(props) {
  return dependency1.createElement(dependency4.ThinkingIndicator, props);
}
export default (function ({ tab: e = "Orbit" }) {
  let [i] = (0, t.useState)(() => Date.now() - 41200 * ("Done" !== e)),
    [s, a] = (0, t.useState)(!1);
  (0, t.useEffect)(() => {
    if ("Done" !== e) return;
    let n = window.setTimeout(() => a(!0), 2400);
    return () => window.clearTimeout(n);
  }, [e]);
  let r = "Done" === e ? "orbit" : e.toLowerCase();
  return (0, n.jsx)(p, {
    variant: r,
    label: "Churning",
    startedAt: i,
    status: s ? "done" : "running",
  });
});
