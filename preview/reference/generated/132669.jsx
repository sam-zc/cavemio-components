"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency3 from "../../../registry/components/testimonials";
("use strict");
var t = dependency0;
function c(props) {
  return dependency1.createElement(dependency3.Testimonials, props);
}
let d = [
  {
    quote:
      "We shipped the new pricing page in an afternoon. The toggle alone got more replies than the launch post.",
    name: "Maya Lindqvist",
    role: "Founder, Northwind",
  },
  {
    quote: "It looks like we hired a studio. We didn’t.",
    name: "Daniel Okafor",
    role: "Solo maker",
  },
  {
    quote:
      "Every state is thought through: loading, empty, failed. Our support inbox noticed before we did.",
    name: "Priya Raman",
    role: "Product lead, Fernhill",
  },
  {
    quote:
      "I stopped fighting the hero section and started writing the product.",
    name: "Tom Becker",
    role: "Indie developer",
  },
];
export default (function ({ tab: e = "Autoplay" }) {
  return (0, t.jsx)("div", {
    className: "w-full max-w-[520px]",
    children: (0, t.jsx)(c, {
      items: d,
      autoplay: "Autoplay" === e ? 5200 : void 0,
    }),
  });
});
