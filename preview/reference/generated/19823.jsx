"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "../../../registry/components/spinner";
import * as dependency2 from "react";
("use strict");
var s = dependency0;
function t(props) {
  return dependency2.createElement(dependency1.Spinner, props);
}
export default (function () {
  return (0, s.jsx)("div", {
    className: "flex flex-col items-center gap-6 text-foreground",
    children: ["ring", "dots", "bars"].map((e) =>
      (0, s.jsxs)(
        "div",
        {
          className: "flex items-center gap-5",
          children: [
            (0, s.jsx)("span", {
              className: "w-10 font-mono text-[11px] text-muted-foreground",
              children: e,
            }),
            (0, s.jsx)(t, { variant: e, size: "xs" }),
            (0, s.jsx)(t, { variant: e, size: "sm" }),
            (0, s.jsx)(t, { variant: e, size: "md" }),
            (0, s.jsx)(t, {
              variant: e,
              size: "lg",
              className: "text-primary",
            }),
          ],
        },
        e,
      ),
    ),
  });
});
