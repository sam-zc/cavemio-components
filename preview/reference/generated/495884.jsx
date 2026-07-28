"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/message-edit";
("use strict");
var t = dependency0;
var n = dependency1;
function p(props) {
  return dependency1.createElement(dependency4.MessageEdit, props);
}
let g = [
  "Cold scoops, warm welcomes.\nChurned on Main Street every morning.",
  "Small batches, big flavor.\nMade at dawn, gone by dusk.",
  "Real cream, slow churned.\nOne scoop and you’re a regular.",
];
export default (function () {
  let [e, r] = (0, n.useState)([
      {
        question: "Write a two-line tagline for our ice cream shop",
        answer:
          "Small batches, big flavor.\nChurned this morning, gone by tonight.",
      },
    ]),
    [i, a] = (0, n.useState)(0),
    [s, o] = (0, n.useState)(null),
    l = (0, n.useRef)(void 0);
  (0, n.useEffect)(() => () => window.clearInterval(l.current), []);
  let u = e[i],
    c = null !== s;
  return (0, t.jsxs)("div", {
    className: "flex w-full max-w-[480px] flex-col gap-5",
    children: [
      (0, t.jsx)(p, {
        text: u.question,
        onSubmit: (t) => {
          let n = g[e.length % g.length],
            i = n.split(/(?<=\s)/);
          (r((e) => [...e, { question: t, answer: n }]), a(e.length), o(""));
          let s = 0;
          (window.clearInterval(l.current),
            (l.current = window.setInterval(() => {
              ((s += 1),
                o(i.slice(0, s).join("")),
                s >= i.length && (window.clearInterval(l.current), o(null)));
            }, 70)));
        },
        disabled: c,
        versions: {
          index: i,
          count: e.length,
          onIndexChange: (e) => !c && a(e),
        },
      }),
      (0, t.jsxs)(
        "p",
        {
          className:
            "min-h-[3.5rem] whitespace-pre-wrap text-[14px] leading-relaxed text-foreground animate-[ui-fade-in_250ms_ease-out_both]",
          children: [
            c ? s : u.answer,
            c &&
              (0, t.jsx)("span", {
                "aria-hidden": "true",
                className:
                  "ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-[ui-blink_1s_steps(1)_infinite] bg-foreground/70",
              }),
          ],
        },
        i,
      ),
    ],
  });
});
