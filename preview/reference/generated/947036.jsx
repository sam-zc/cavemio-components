"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "../../../registry/components/accordion";
("use strict");
var t = dependency0;
var n = dependency1;
let a = [
  {
    value: "shipping",
    title: "Delivery",
    subtitle: "London, 2 to 3 days",
    content:
      "We pack ice cream in dry ice and ship Monday to Wednesday so nothing sits in a depot over the weekend.",
  },
  {
    value: "returns",
    title: "Returns",
    content:
      "If a tub arrives soft, send a photo within a day and we'll send another or refund you.",
  },
  {
    value: "allergens",
    title: "Allergens",
    content:
      "Every flavour is made in a kitchen that handles nuts and milk. Sorbets are dairy free.",
  },
];
export default (function ({ tab: e = "Rows" }) {
  return (0, t.jsx)("div", {
    className: "w-full max-w-[360px]",
    children: (0, t.jsx)(n.Accordion, {
      items: a,
      variant: "Cards" === e ? "cards" : "rows",
      defaultValue: ["shipping"],
    }),
  });
});
