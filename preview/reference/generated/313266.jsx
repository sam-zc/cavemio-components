"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency8 from "../../../registry/components/chat-notice";
("use strict");
var t = dependency0;
var r = dependency1;
function k(props) {
  return dependency1.createElement(dependency8.ChatNotice, props);
}
export default (function ({ tab: e = "Error" }) {
  let [i, n] = (0, r.useState)("Offline" === e),
    [s] = (0, r.useState)(() => Date.now() + 12e3);
  (0, r.useEffect)(() => {
    if (!i) return;
    let t = window.setTimeout(() => n(!1), "Offline" === e ? 2600 : 1800);
    return () => window.clearTimeout(t);
  }, [i, e]);
  let a = () => n(!0);
  return (0, t.jsxs)("div", {
    className: "w-full max-w-[460px]",
    children: [
      "Error" === e &&
        (0, t.jsx)(k, {
          kind: "error",
          details: "504 Gateway Timeout · req_8f2k1c",
          onRetry: a,
          retrying: i,
        }),
      "Offline" === e &&
        (0, t.jsx)(k, { kind: "offline", onRetry: a, retrying: i }),
      "Rate limit" === e &&
        (0, t.jsx)(k, {
          kind: "rate-limit",
          resetAt: s,
          onUpgrade: () => {},
          upgradeLabel: "Upgrade to Pro",
        }),
      "Long chat" === e &&
        (0, t.jsx)(k, {
          kind: "context",
          onNewChat: () => {},
          onSummarize: () => {},
        }),
    ],
  });
});
