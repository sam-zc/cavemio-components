"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "lucide-react";
import * as dependency2 from "react";
import * as dependency11 from "../../../registry/components/buy-box";
("use strict");
var t = dependency0;
var r = dependency1;
function w(props) {
  return dependency2.createElement(dependency11.BuyBox, props);
}
let j = (e) => new Promise((t) => setTimeout(t, e));
let k = [
  {
    id: "colour",
    label: "Colour",
    values: [
      { id: "sand", label: "Sand", swatch: "#d9c6a3" },
      { id: "olive", label: "Olive", swatch: "#6f7a52" },
      { id: "ink", label: "Ink", swatch: "#2e3a4f" },
      { id: "clay", label: "Clay", swatch: "#b8664b" },
    ],
  },
  {
    id: "size",
    label: "Size",
    values: ["XS", "S", "M", "L", "XL"].map((e) => ({
      id: e.toLowerCase(),
      label: e,
    })),
  },
];
let $ = k[0].values.flatMap((e) =>
  k[1].values
    .filter((t) => "clay" !== e.id || "xl" !== t.id)
    .map((t) => ({
      id: `${e.id}-${t.id}`,
      options: { colour: e.id, size: t.id },
      price: "clay" === e.id ? 96 : 128,
      compareAt: "clay" === e.id ? 128 : void 0,
      stock:
        ("ink" === e.id && "xs" === t.id) || ("ink" === e.id && "m" === t.id)
          ? 0
          : "olive" === e.id && "l" === t.id
            ? 2
            : void 0,
    })),
);
let N = {
  Buy: { colour: "sand", size: "m" },
  "Sold out": { colour: "ink", size: "m" },
  Sale: { colour: "clay", size: "s" },
};
export default (function ({ tab: e = "Buy" }) {
  return (0, t.jsx)(
    w,
    {
      brand: "Fernhill Supply",
      name: "Linen overshirt",
      icon: (0, t.jsx)(r.Shirt, {}),
      options: k,
      variants: $,
      defaultSelection: N[e] ?? N.Buy,
      bagCount: 1,
      locale: "en-US",
      onAddToCart: async () => {
        await j(700);
      },
      onNotify: async () => {
        await j(800);
      },
    },
    e,
  );
});
