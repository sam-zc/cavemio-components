"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency8 from "../../../registry/components/multi-select";
("use strict");
var t = dependency0;
var r = dependency1;
function u(props) {
  return dependency1.createElement(dependency8.MultiSelect, props);
}
let c = [
  "Design",
  "Engineering",
  "Sales",
  "Support",
  "Marketing",
  "Finance",
  "Legal",
  "People",
  "Operations",
  "Research",
].map((e) => ({ value: e.toLowerCase(), label: e }));
export default (function ({ tab: e = "Filter" }) {
  let [n, o] = r.useState(["open", "pending"]);
  return "Long list" === e
    ? (0, t.jsx)("div", {
        className: "w-full max-w-[300px]",
        children: (0, t.jsx)(u, {
          label: "Teams that can see this",
          options: c,
          defaultValue: ["design", "engineering", "sales", "support"],
        }),
      })
    : (0, t.jsxs)("div", {
        className: "flex w-full max-w-[300px] flex-col gap-3",
        children: [
          (0, t.jsx)(u, {
            label: "Status",
            value: n,
            onValueChange: o,
            placeholder: "Any status",
            options: [
              { value: "open", label: "Open", description: "Waiting on us" },
              {
                value: "pending",
                label: "Pending",
                description: "Waiting on the customer",
              },
              { value: "solved", label: "Solved" },
              { value: "spam", label: "Spam" },
            ],
          }),
          (0, t.jsxs)("p", {
            className: "px-3 text-[12px] text-muted-foreground",
            children: [
              "Showing ",
              n.length ? n.join(" and ") : "every",
              " ticket",
              1 === n.length ? "" : "s",
            ],
          }),
        ],
      });
});
