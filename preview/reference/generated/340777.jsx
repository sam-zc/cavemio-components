"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/waitlist-field";
("use strict");
var t = dependency0;
var s = dependency1;
var n = dependency2;
export default (function ({ tab: e = "Join" }) {
  let i = (0, s.useRef)(0),
    r = async () => {
      if (
        (await new Promise((e) => window.setTimeout(e, 1400)),
        "Error" === e && 0 == i.current++)
      )
        throw Error("Network");
      return { position: 1248 };
    };
  return (0, t.jsxs)("div", {
    className:
      "flex w-full max-w-[440px] flex-col items-center gap-5 text-center",
    children: [
      (0, t.jsxs)("div", {
        children: [
          (0, t.jsx)("p", {
            className:
              "text-[24px] font-medium tracking-[-0.03em] text-foreground",
            children: "Be first to try Relay",
          }),
          (0, t.jsx)("p", {
            className: "mt-1 text-[13.5px] text-muted-foreground",
            children: "One email when it’s ready. Nothing else.",
          }),
        ],
      }),
      (0, t.jsx)(n.WaitlistField, {
        onSubmit: r,
        joined: "Joined" === e ? { position: 1248 } : null,
      }),
    ],
  });
});
