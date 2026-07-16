"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency7 from "../../../registry/components/expanding-gallery";
import * as dependency8 from "./25369.jsx";
("use strict");
var t = dependency0;
function g(props) {
  return dependency1.createElement(dependency7.ExpandingGallery, props);
}
var x = dependency8;
let b = [
  {
    id: "sola",
    src: "/demos/cavemio/demos/stillform/images/sola-campaign.webp",
    alt: "An amber Sola perfume bottle in warm architectural light",
    title: "Sola, in the afternoon",
    meta: "Campaign · 2026",
    description:
      "A study in amber, soft shadows and the last light of the afternoon.",
    width: 1536,
    height: 1024,
  },
  {
    id: "nori",
    src: "/demos/cavemio/demos/stillform/images/nori-campaign.webp",
    alt: "Nori skincare on sculpted pale green and limestone surfaces",
    title: "A quieter kind of care",
    meta: "Art direction · 2026",
    description:
      "Sculptural paper, limestone and a palette borrowed from the garden.",
    width: 1536,
    height: 1024,
  },
  {
    id: "tempo",
    src: "/demos/cavemio/demos/stillform/images/tempo-campaign.webp",
    alt: "Tempo product campaign with a carefully arranged studio composition",
    title: "Finding the rhythm",
    meta: "Still life · 2026",
    description:
      "Everyday objects, composed with a little more room to breathe.",
    width: 1536,
    height: 1024,
  },
  {
    id: "sola-detail",
    src: "/demos/cavemio/demos/stillform/images/sola-packshot.webp",
    alt: "A studio portrait of the Sola perfume bottle",
    title: "The essential form",
    meta: "Product study · 2026",
    description:
      "One object. A considered surface. Nothing else competing for attention.",
    width: 1536,
    height: 1024,
  },
];
export default (function () {
  return (0, t.jsxs)("div", {
    style: (0, x.demoAppearance)(),
    className: "w-full max-w-[620px] rounded-2xl bg-background",
    children: [
      (0, t.jsx)(g, { images: b, label: "Stillform / Selected studies" }),
      (0, t.jsx)("p", {
        className: "mt-6 text-center text-[11px] text-muted-foreground",
        children: "Open a study. Browse with arrows, or swipe.",
      }),
    ],
  });
});
