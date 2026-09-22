"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency10 from "../../../registry/components/cart";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency2;
var a = dependency2;
var s = dependency2;
function k(props) {
  return dependency1.createElement(dependency10.Cart, props);
}
let $ = (e) => new Promise((t) => setTimeout(t, e));
let S = [
  {
    id: "shirt",
    name: "Linen overshirt",
    variant: "Sand · M",
    price: 128,
    quantity: 1,
    max: 4,
    icon: (0, t.jsx)(a.Shirt, { strokeWidth: 1.6 }),
  },
  {
    id: "socks",
    name: "Merino trail socks",
    variant: "Oat · 2 pairs",
    price: 24,
    quantity: 2,
    icon: (0, t.jsx)(n.Footprints, { strokeWidth: 1.6 }),
  },
  {
    id: "tote",
    name: "Waxed canvas tote",
    variant: "Olive",
    price: 46,
    quantity: 1,
    icon: (0, t.jsx)(s.ShoppingBag, { strokeWidth: 1.6 }),
  },
];
function _({ tab: e }) {
  let [n, a] = (0, r.useState)(S);
  return (0, t.jsx)(k, {
    title: "Fernhill Supply",
    items: n,
    shipping: 8,
    freeShippingAt: 250,
    locale: "en-US",
    onQuantityChange: async (t, r) => {
      if ((await $(500), "Low stock" === e && "shirt" === t && r > 2))
        throw Error("Only 2 left in Sand · M.");
      a((e) => e.map((e) => (e.id === t ? { ...e, quantity: r } : e)));
    },
    onRemove: async (e) => {
      (await $(300), a((t) => t.filter((t) => t.id !== e)));
    },
    onApplyCode: async (t) => {
      if ((await $(700), "Code refused" === e))
        throw Error(`${t.toUpperCase()} has expired.`);
      return {
        code: t.toUpperCase(),
        percent: Number(t.match(/\d+/)?.[0] ?? 15) || 15,
      };
    },
    onCheckout: async () => {
      await $(1200);
    },
  });
}
export default (function ({ tab: e = "Cart" }) {
  return (0, t.jsx)(_, { tab: e }, e);
});
