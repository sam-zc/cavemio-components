"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/inline-rewrite";
("use strict");
var t = dependency0;
var r = dependency1;
function m(props) {
  return dependency1.createElement(dependency4.InlineRewrite, props);
}
let f = [
  {
    label: "Shortest",
    text: "Fresh beans from small roasters, at your door every two weeks.",
  },
  {
    label: "Shorter",
    text: "Fresh beans from small roasters, roasted to order and at your door every two weeks. Skip or cancel anytime.",
  },
  {
    label: "Original",
    text: "Kept sends fresh beans from small roasters, roasted to order and at your door every two weeks. Each bag comes with a note from the roaster on how to brew it. Skip a delivery or cancel anytime from your phone.",
  },
  {
    label: "Longer",
    text: "Kept sends fresh beans from small roasters across Europe, roasted to order on Monday and at your door every two weeks. Each bag comes with a handwritten note from the roaster on where the beans grew and how to brew it. Skip a delivery, swap a bag or cancel anytime from your phone, with no calls and no forms.",
  },
  {
    label: "Longest",
    text: "Kept sends fresh beans from small roasters across Europe, roasted to order on Monday and at your door every two weeks. Each bag comes with a handwritten note from the roaster on where the beans grew and how to brew it. Skip a delivery, swap a bag or cancel anytime from your phone, with no calls and no forms. And if a bag doesn’t become your favourite, the next one is on us.",
  },
];
let p = [
  { label: "Blunt" },
  {
    label: "Neutral",
    text: "Sorry, your order shipped late. It should arrive on Thursday, and we’ve refunded the shipping.",
  },
  { label: "Warm" },
  { label: "Playful" },
];
let x = {
  Blunt:
    "Your order shipped late. It arrives on Thursday. We’ve refunded the shipping.",
  Warm: "We’re so sorry your order shipped late. It should arrive on Thursday, and we’ve refunded the shipping so you’re not out of pocket. Thank you for bearing with us.",
  Playful:
    "Your beans took the scenic route, sorry about that. They should arrive on Thursday, and we’ve refunded the shipping. The next coffee’s on us.",
};
function g() {
  let [e, a] = (0, r.useState)(2),
    [n, o] = (0, r.useState)(!0);
  return (
    (0, r.useEffect)(() => {
      if (!n) return;
      let e = [1, 0, 1, 2, 3, 4, 3, 2],
        t = e.map((e, t) => window.setTimeout(() => a(e), 1400 + 2100 * t));
      return (
        t.push(window.setTimeout(() => o(!1), 1400 + 2100 * e.length)),
        () => t.forEach((e) => window.clearTimeout(e))
      );
    }, [n]),
    (0, t.jsxs)("div", {
      onPointerDownCapture: () => o(!1),
      onKeyDownCapture: () => o(!1),
      children: [
        (0, t.jsx)("p", {
          className: "mb-3 text-[13px] font-medium text-foreground",
          children: "Product description",
        }),
        (0, t.jsx)(m, {
          versions: f,
          value: e,
          onValueChange: a,
          label: "Length",
        }),
      ],
    })
  );
}
function b() {
  return (0, t.jsxs)("div", {
    children: [
      (0, t.jsx)("p", {
        className: "text-[13px] font-medium text-foreground",
        children: "Re: Where’s my order?",
      }),
      (0, t.jsx)("p", {
        className: "mb-3 text-[11.5px] text-muted-foreground",
        children: "Reply to Maya, drafted",
      }),
      (0, t.jsx)(m, {
        versions: p,
        defaultValue: 1,
        label: "Tone",
        onRewrite: ({ label: e }) =>
          new Promise((t) => window.setTimeout(() => t(x[e]), 1300)),
      }),
    ],
  });
}
export default (function ({ tab: e = "Length" }) {
  return (0, t.jsxs)("div", {
    className: "flex h-[400px] w-full max-w-[440px] flex-col sm:h-[340px]",
    children: [
      (0, t.jsx)("div", {
        className: "rounded-[20px] border border-border bg-card p-4",
        children: "Tone" === e ? (0, t.jsx)(b, {}) : (0, t.jsx)(g, {}),
      }),
      (0, t.jsx)("p", {
        className: "mt-3 text-center text-[12px] text-muted-foreground",
        children: "Drag the dial.",
      }),
    ],
  });
});
