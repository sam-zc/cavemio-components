"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/pagination";
("use strict");
var t = dependency0;
var r = dependency1;
function i(props) {
  return dependency1.createElement(dependency4.Pagination, props);
}
export default (function () {
  let [e, n] = r.useState(3);
  return (0, t.jsxs)("div", {
    className: "flex w-full max-w-[420px] flex-col items-center gap-3",
    children: [
      (0, t.jsx)(i, { page: e, pageCount: 12, onPageChange: n }),
      (0, t.jsxs)("p", {
        className: "text-[12px] tabular-nums text-muted-foreground",
        children: [
          "Invoices ",
          (e - 1) * 20 + 1,
          "–",
          Math.min(20 * e, 231),
          " of 231",
        ],
      }),
    ],
  });
});
