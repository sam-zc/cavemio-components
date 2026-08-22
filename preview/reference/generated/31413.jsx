"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/tabs";
("use strict");
var t = dependency0;
function a(props) {
  return dependency1.createElement(dependency4.Tabs, props);
}
let o = ({ k: e, v: r }) =>
  (0, t.jsxs)("div", {
    className:
      "flex justify-between border-b border-border py-2 text-[13px] last:border-0",
    children: [
      (0, t.jsx)("span", { className: "text-muted-foreground", children: e }),
      (0, t.jsx)("span", { className: "text-foreground", children: r }),
    ],
  });
let s = [
  {
    value: "overview",
    label: "Overview",
    content: (0, t.jsxs)("div", {
      children: [
        (0, t.jsx)(o, { k: "Visitors", v: "12,480" }),
        (0, t.jsx)(o, { k: "Signups", v: "384" }),
        (0, t.jsx)(o, { k: "Conversion", v: "3.1%" }),
      ],
    }),
  },
  {
    value: "sources",
    label: "Sources",
    count: 4,
    content: (0, t.jsxs)("div", {
      children: [
        (0, t.jsx)(o, { k: "Search", v: "5,210" }),
        (0, t.jsx)(o, { k: "Direct", v: "3,902" }),
        (0, t.jsx)(o, { k: "X", v: "2,104" }),
        (0, t.jsx)(o, { k: "Newsletter", v: "1,264" }),
      ],
    }),
  },
  {
    value: "notes",
    label: "Notes",
    content: (0, t.jsx)("p", {
      className: "text-[13px] leading-relaxed text-muted-foreground",
      children:
        "Launch week. Traffic from X doubled on Tuesday after the Cubby thread.",
    }),
  },
];
export default (function ({ tab: e = "Underline" }) {
  return (0, t.jsx)("div", {
    className: "w-full max-w-[360px]",
    children: (0, t.jsx)(a, {
      label: "Report",
      variant: "Pills" === e ? "pills" : "underline",
      items: s,
    }),
  });
});
