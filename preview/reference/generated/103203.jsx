"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency5 from "../../../registry/components/collapsible";
("use strict");
var s = dependency0;
function r(props) {
  return dependency1.createElement(dependency5.Collapsible, props);
}
let a = [
  "Ada Okafor",
  "Bram Visser",
  "Chen Wei",
  "Dara Byrne",
  "Elif Kaya",
  "Farah Malik",
  "Gus Moreno",
];
let i = ({ name: e }) =>
  (0, s.jsxs)("div", {
    className: "flex items-center justify-between py-2 text-[13.5px]",
    children: [
      (0, s.jsx)("span", { className: "text-foreground", children: e }),
      (0, s.jsx)("span", {
        className: "text-[12px] text-muted-foreground",
        children: "Editor",
      }),
    ],
  });
export default (function ({ tab: e = "List" }) {
  return "Details" === e
    ? (0, s.jsx)("div", {
        className: "w-full max-w-[340px]",
        children: (0, s.jsx)(r, {
          placement: "top",
          labels: { closed: "Show advanced", open: "Hide advanced" },
          children: (0, s.jsxs)("div", {
            className:
              "flex flex-col gap-1 pt-2 text-[13px] text-muted-foreground",
            children: [
              (0, s.jsx)("p", {
                children: "Webhook retries: 5, backing off from 10s.",
              }),
              (0, s.jsx)("p", {
                children: "Signing secret rotates every 90 days.",
              }),
            ],
          }),
        }),
      })
    : (0, s.jsxs)("div", {
        className: "flex w-full max-w-[300px] flex-col",
        children: [
          a.slice(0, 3).map((e) => (0, s.jsx)(i, { name: e }, e)),
          (0, s.jsx)(r, {
            labels: { closed: `Show ${a.length - 3} more`, open: "Show less" },
            children: a.slice(3).map((e) => (0, s.jsx)(i, { name: e }, e)),
          }),
        ],
      });
});
