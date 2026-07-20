"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency6 from "../../../registry/components/image-compare";
import * as dependency7 from "./25369.jsx";
("use strict");
var r = dependency0;
function f(props) {
  return dependency1.createElement(dependency6.ImageCompare, props);
}
var p = dependency7;
let x = "/demos/cavemio/demos/stillform/images/nori-campaign.webp";
export default (function () {
  return (0, r.jsxs)("div", {
    style: (0, p.demoAppearance)(),
    className: "w-full max-w-[620px] text-foreground",
    children: [
      (0, r.jsxs)("div", {
        className: "mb-5 flex items-end justify-between gap-3",
        children: [
          (0, r.jsxs)("div", {
            children: [
              (0, r.jsx)("p", {
                className:
                  "text-[10px] uppercase tracking-[0.16em] text-muted-foreground",
                children: "Nori / Colour study",
              }),
              (0, r.jsx)("h3", {
                className: "mt-2 text-[23px] font-medium tracking-[-0.04em]",
                children: "A little more life.",
              }),
            ],
          }),
          (0, r.jsx)("span", {
            className: "pb-1 font-mono text-[10px] text-muted-foreground",
            children: "01 — 02",
          }),
        ],
      }),
      (0, r.jsx)(f, {
        before: {
          src: x,
          alt: "Nori campaign with a monochrome treatment",
          className: "grayscale contrast-[0.9]",
        },
        after: {
          src: x,
          alt: "Nori campaign in its original soft green colour palette",
        },
        beforeLabel: "Monochrome",
        afterLabel: "Colour study",
        defaultValue: 48,
        aspectRatio: 1.5,
      }),
      (0, r.jsx)("p", {
        className: "mt-4 text-center text-[11px] text-muted-foreground",
        children: "Drag the divide. Double-click to bring it home.",
      }),
    ],
  });
});
