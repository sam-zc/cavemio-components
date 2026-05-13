"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency3 from "../../../registry/components/citation";
("use strict");
var t = dependency0;
function a(props) {
  return dependency1.createElement(dependency3.Citation, props);
}
let s = [
  {
    title: "CSS Custom Highlight API",
    url: "https://developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API",
    snippet:
      "Style any range of text by registering Range objects as a named highlight, without adding elements to the page.",
  },
  {
    title: "CSS Custom Highlight API: browser support",
    url: "https://caniuse.com/mdn-api_highlight",
    snippet:
      "Support tables for the Highlight interface across desktop and mobile browsers.",
  },
  {
    title: "Building a selection toolbar",
    url: "https://example.com/selection-toolbars",
  },
];
export default (function () {
  return (0, t.jsxs)("p", {
    className: "max-w-[460px] text-[14px] leading-7 text-foreground",
    children: [
      "The Custom Highlight API styles a range of text without changing the DOM",
      (0, t.jsx)(a, { index: 1, source: s[0] }),
      ", and it now ships in Chrome, Safari and Firefox",
      (0, t.jsx)(a, { index: 2, source: s[1] }),
      ". Paired with the Selection API it keeps text marked while you type in a toolbar",
      (0, t.jsx)(a, { index: 3, source: s[2], status: "unavailable" }),
      ".",
    ],
  });
});
