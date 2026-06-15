"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/text-morph";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency2;
let a = [
  "Save",
  "Saving",
  "Saved",
  "Copy link",
  "Copied",
  "Follow",
  "Following",
  "Subscribe",
];
let i = ["founders", "designers", "agencies", "indie makers"];
export default (function ({ tab: e = "Labels" }) {
  let [s, o] = (0, r.useState)("Save"),
    [l, d] = (0, r.useState)(0);
  return ((0, r.useEffect)(() => {
    if ("Headline" !== e) return;
    let t = window.setInterval(() => d((e) => (e + 1) % i.length), 2200);
    return () => window.clearInterval(t);
  }, [e]),
  "Headline" === e)
    ? (0, t.jsxs)("p", {
        className:
          "text-center text-[44px] font-medium leading-[1.1] tracking-[-0.04em] text-foreground",
        children: [
          "Landing pages for ",
          (0, t.jsx)(n.TextMorph, {
            className: "text-primary",
            children: i[l],
          }),
        ],
      })
    : (0, t.jsxs)("div", {
        className: "flex flex-col items-center gap-8",
        children: [
          (0, t.jsx)(n.TextMorph, {
            className:
              "text-[52px] font-medium leading-[1.1] tracking-[-0.04em] text-foreground",
            children: s,
          }),
          (0, t.jsx)("div", {
            className: "flex max-w-[420px] flex-wrap justify-center gap-1.5",
            children: a.map((e) =>
              (0, t.jsx)(
                "button",
                {
                  type: "button",
                  onClick: () => o(e),
                  "aria-pressed": e === s,
                  className: `cursor-pointer h-8 rounded-full px-3 text-[12.5px] transition-colors ${e === s ? "bg-foreground text-background" : "text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)] hover:text-foreground"}`,
                  children: e,
                },
                e,
              ),
            ),
          }),
        ],
      });
});
