"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/logo-marquee";
("use strict");
var r = dependency0;
function l(props) {
  return dependency1.createElement(dependency2.LogoMarquee, props);
}
function i({ name: e, shape: t }) {
  let n = {
    circle: (0, r.jsx)("circle", {
      cx: "8",
      cy: "8",
      r: "6",
      fill: "currentColor",
    }),
    square: (0, r.jsx)("rect", {
      x: "2.5",
      y: "2.5",
      width: "11",
      height: "11",
      rx: "3",
      fill: "currentColor",
    }),
    triangle: (0, r.jsx)("path", {
      d: "M8 2.5 14 13.5H2Z",
      fill: "currentColor",
    }),
    ring: (0, r.jsx)("circle", {
      cx: "8",
      cy: "8",
      r: "5.25",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.5",
    }),
    bars: (0, r.jsx)("path", {
      d: "M3 3h2.5v10H3zM6.75 6h2.5v7h-2.5zM10.5 4.5H13V13h-2.5z",
      fill: "currentColor",
    }),
    diamond: (0, r.jsx)("path", {
      d: "M8 1.5 14.5 8 8 14.5 1.5 8Z",
      fill: "currentColor",
    }),
  }[t];
  return (0, r.jsxs)("span", {
    role: "img",
    "aria-label": e,
    className:
      "flex items-center gap-2 text-[17px] font-semibold tracking-[-0.03em]",
    children: [
      (0, r.jsx)("svg", {
        "aria-hidden": "true",
        viewBox: "0 0 16 16",
        className: "size-[18px]",
        children: n,
      }),
      e,
    ],
  });
}
let s = [
  (0, r.jsx)(i, { name: "Northwind", shape: "triangle" }, "a"),
  (0, r.jsx)(i, { name: "Fernhill", shape: "circle" }, "b"),
  (0, r.jsx)(i, { name: "Quillon", shape: "square" }, "c"),
  (0, r.jsx)(i, { name: "Arcfield", shape: "ring" }, "d"),
  (0, r.jsx)(i, { name: "Bramble", shape: "bars" }, "e"),
  (0, r.jsx)(i, { name: "Oakline", shape: "diamond" }, "f"),
];
export default (function () {
  return (0, r.jsxs)("div", {
    className: "flex w-full max-w-[720px] flex-col items-center gap-6",
    children: [
      (0, r.jsx)("p", {
        className: "text-[12.5px] text-muted-foreground",
        children: "Trusted by teams who ship weekly",
      }),
      (0, r.jsx)(l, { logos: s }),
    ],
  });
});
