"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/code-input";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency2;
let i = (e) => new Promise((t) => setTimeout(t, e));
let a = "424242";
export default (function ({ tab: e = "Try it" }) {
  let [s, o] = (0, r.useState)("");
  return (
    (0, r.useEffect)(() => {
      if ("Try it" === e) return;
      let t = window.setTimeout(() => o("Autofill" === e ? a : "138507"), 900);
      return () => window.clearTimeout(t);
    }, [e]),
    (0, t.jsxs)("div", {
      className: "flex w-full max-w-[360px] flex-col items-start gap-1",
      children: [
        (0, t.jsx)("p", {
          className:
            "text-[15px] font-medium tracking-[-0.01em] text-foreground",
          children: "Check your phone",
        }),
        (0, t.jsxs)("p", {
          className: "mb-4 text-[13px] text-muted-foreground",
          children: [
            "We sent a code to •• •• 4417.",
            "Try it" === e ? ` Try ${a}, or anything else to see it fail.` : "",
          ],
        }),
        (0, t.jsx)(n.CodeInput, {
          value: s,
          onValueChange: o,
          groups: [3, 3],
          autoFocus: "Try it" === e,
          onComplete: async (e) => (await i(1100), e === a),
          onResend: () => i(900),
        }),
      ],
    })
  );
});
