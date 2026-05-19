"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/kbd";
("use strict");
var t = dependency0;
function d(props) {
  return dependency1.createElement(dependency2.Kbd, props);
}
let c = [
  ["Search", "mod+k"],
  ["New file", "mod+n"],
  ["Command menu", "shift+mod+p"],
  ["Next result", "down"],
  ["Close", "esc"],
];
export default (function () {
  return (0, t.jsxs)("div", {
    className: "flex w-full max-w-[280px] flex-col gap-2.5",
    children: [
      c.map(([e, r]) =>
        (0, t.jsxs)(
          "div",
          {
            className:
              "flex items-center justify-between text-[13.5px] text-foreground",
            children: [e, (0, t.jsx)(d, { keys: r, live: !0 })],
          },
          e,
        ),
      ),
      (0, t.jsx)("p", {
        className: "pt-2 text-center text-[12px] text-muted-foreground",
        children: "Press the keys",
      }),
    ],
  });
});
