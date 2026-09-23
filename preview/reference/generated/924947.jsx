"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "lucide-react";
import * as dependency2 from "react";
import * as dependency9 from "../../../registry/components/checkout";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency1;
var a = dependency1;
function N(props) {
  return dependency2.createElement(dependency9.Checkout, props);
}
let $ = [
  {
    id: "shirt",
    name: "Linen overshirt",
    detail: "Sand · M",
    quantity: 1,
    price: 128,
    icon: (0, t.jsx)(n.Shirt, { strokeWidth: 1.6 }),
  },
  {
    id: "socks",
    name: "Merino trail socks",
    detail: "Oat · 2 pairs",
    quantity: 2,
    price: 24,
    icon: (0, t.jsx)(r.Footprints, { strokeWidth: 1.6 }),
  },
  {
    id: "tote",
    name: "Waxed canvas tote",
    detail: "Olive",
    quantity: 1,
    price: 46,
    icon: (0, t.jsx)(a.ShoppingBag, { strokeWidth: 1.6 }),
  },
];
let S = [
  {
    id: "standard",
    label: "Standard",
    detail: "Tracked",
    price: 0,
    days: [3, 5],
  },
  {
    id: "express",
    label: "Express",
    detail: "Next working day",
    price: 12,
    days: 1,
  },
  {
    id: "store",
    label: "Collect in store",
    detail: "Fernhill, Leeds",
    price: 0,
    days: 2,
  },
];
function _() {
  return (0, t.jsx)("div", {
    className:
      "flex h-24 items-center justify-center rounded-[16px] border border-dashed border-border px-4 text-center text-[12.5px] text-muted-foreground",
    children: "Your payment provider’s element goes here",
  });
}
export default (function ({ tab: e = "Checkout" }) {
  let r = "Checkout" !== e;
  return (0, t.jsx)(
    N,
    {
      lines: $,
      deliveries: S,
      discount: 20,
      defaultEmail: r ? "iris@fernhill.co" : "",
      defaultAddress: r
        ? {
            name: "Iris Okafor",
            line1: "12 Elm Street",
            city: "Leeds",
            postcode: "LS1 4AB",
            country: "GB",
          }
        : void 0,
      payment: (0, t.jsx)(_, {}),
      locale: "en-US",
      onPlaceOrder: async () => {
        if ((await new Promise((e) => setTimeout(e, 1300)), "Declined" === e))
          throw Error("Your card was declined. Try another one.");
        return { number: "HL-2048" };
      },
    },
    e,
  );
});
