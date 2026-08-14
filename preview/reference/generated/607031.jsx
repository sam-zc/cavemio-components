"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "../../../registry/components/select";
("use strict");
var t = dependency0;
var r = dependency1;
let n = [
  { value: "london", label: "London", description: "GMT+1" },
  { value: "new-york", label: "New York", description: "GMT-4" },
  { value: "berlin", label: "Berlin", description: "GMT+2" },
  { value: "tokyo", label: "Tokyo", description: "GMT+9" },
];
export default (function ({ tab: e = "Field" }) {
  return "Inline" === e
    ? (0, t.jsxs)("div", {
        className:
          "flex items-center gap-2 whitespace-nowrap text-[13px] text-muted-foreground",
        children: [
          "Sort by",
          (0, t.jsx)(r.Select, {
            label: "Sort by",
            hideLabel: !0,
            size: "sm",
            block: !1,
            defaultValue: "newest",
            options: [
              { value: "newest", label: "Newest" },
              { value: "oldest", label: "Oldest" },
              { value: "name", label: "Name" },
            ],
          }),
        ],
      })
    : (0, t.jsx)("div", {
        className: "w-full max-w-[300px]",
        children: (0, t.jsx)(r.Select, {
          label: "Timezone",
          defaultValue: "london",
          options: n,
          hint: "Reports go out at 9am in this zone.",
        }),
      });
});
