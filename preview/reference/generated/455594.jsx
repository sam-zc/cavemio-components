"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/faq-accordion";
("use strict");
var t = dependency0;
function a(props) {
  return dependency1.createElement(dependency2.FaqAccordion, props);
}
let l = [
  {
    question: "Can I use it for client work?",
    answer:
      "Yes. One licence covers your own products and the sites you build for clients. You can’t resell the template itself as a template.",
  },
  {
    question: "Do I need to know Next.js?",
    answer:
      "A little helps. Every word, link and image lives in one config file, so most launches never touch a component.",
  },
  {
    question: "What happens when you ship an update?",
    answer:
      "You get it for free, forever. Updates arrive as a new download with a short changelog of what moved.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "Within 14 days, no questions asked. Reply to your receipt and it’s done.",
  },
];
export default (function ({ tab: e = "Single" }) {
  return (0, t.jsx)("div", {
    className: "w-full max-w-[560px]",
    children: (0, t.jsx)(
      a,
      {
        items: l,
        type: "Multiple" === e ? "multiple" : "single",
        defaultOpen: [0],
      },
      e,
    ),
  });
});
