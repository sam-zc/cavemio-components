"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/sortable-list";
("use strict");
var t = dependency0;
var r = dependency1;
function f(props) {
  return dependency1.createElement(dependency4.SortableList, props);
}
let m = [
  { id: "csv", name: "CSV export", votes: 168, effort: "S" },
  { id: "seats", name: "Team seats", votes: 342, effort: "L" },
  { id: "dark", name: "Dark mode", votes: 214, effort: "M" },
  { id: "slack", name: "Slack alerts", votes: 97, effort: "S" },
  { id: "api", name: "Public API", votes: 256, effort: "L" },
];
let p = { S: 0, M: 1, L: 2 };
let x = [
  { label: "Votes", compare: (e, t) => t.votes - e.votes },
  {
    label: "Effort",
    compare: (e, t) => p[e.effort] - p[t.effort] || t.votes - e.votes,
  },
  { label: "A–Z", compare: (e, t) => e.name.localeCompare(t.name) },
];
export default (function () {
  let [e, n] = (0, r.useState)(m);
  return (0, t.jsxs)("div", {
    className: "w-full max-w-[420px]",
    children: [
      (0, t.jsx)("p", {
        className: "mb-3 text-[13px] font-medium text-foreground",
        children: "Next quarter, in order",
      }),
      (0, t.jsx)(f, {
        items: e,
        onReorder: n,
        sorts: x,
        getLabel: (e) => e.name,
        label: "Roadmap priorities",
        renderItem: (e) =>
          (0, t.jsxs)("div", {
            className: "flex items-center gap-2",
            children: [
              (0, t.jsx)("span", {
                className:
                  "min-w-0 flex-1 truncate text-[13.5px] font-medium text-foreground",
                children: e.name,
              }),
              (0, t.jsx)("span", {
                className:
                  "shrink-0 rounded-[5px] border border-border px-1.5 text-[11px] leading-5 text-muted-foreground",
                children: e.effort,
              }),
              (0, t.jsxs)("span", {
                className:
                  "w-12 shrink-0 text-right text-[12px] tabular-nums text-muted-foreground",
                children: [e.votes, " ↑"],
              }),
            ],
          }),
      }),
      (0, t.jsx)("p", {
        className: "mt-3 text-center text-[12px] text-muted-foreground",
        children: "Drag a grip, or focus one and press Space.",
      }),
    ],
  });
});
