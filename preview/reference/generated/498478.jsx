"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/response-versions";
("use strict");
var t = dependency0;
var r = dependency1;
function h(props) {
  return dependency1.createElement(dependency4.ResponseVersions, props);
}
let m = [
  "Fresh beans at your door before the bag runs out.",
  "Roasted on Monday. In your cup by Thursday.",
  "Your next bag ships before you notice you need it.",
  "Good coffee, on a schedule you never think about.",
  "Small-batch roasts, delivered while they still matter.",
];
export default (function () {
  let [e, n] = (0, r.useState)(m.slice(0, 3)),
    [s, a] = (0, r.useState)(2),
    [i, o] = (0, r.useState)(!1),
    l = (0, r.useRef)(void 0);
  (0, r.useEffect)(() => () => window.clearTimeout(l.current), []);
  let u = e.length;
  return (
    (0, r.useEffect)(() => a(u - 1), [u]),
    (0, t.jsxs)("div", {
      className: "w-full max-w-[420px]",
      children: [
        (0, t.jsx)("p", {
          className:
            "mb-4 ml-auto w-fit rounded-2xl bg-muted px-3.5 py-2 text-[13px] text-foreground",
          children: "A tagline for our coffee subscription?",
        }),
        (0, t.jsx)(h, {
          count: e.length,
          index: s,
          onIndexChange: a,
          onRegenerate: () => {
            (o(!0),
              (l.current = window.setTimeout(() => {
                (n((e) => [...e, m[e.length % m.length]]), o(!1));
              }, 1400)));
          },
          regenerating: i,
          children: (0, t.jsx)("p", {
            className: "text-[15px] leading-relaxed text-foreground",
            children: e[s],
          }),
        }),
      ],
    })
  );
});
