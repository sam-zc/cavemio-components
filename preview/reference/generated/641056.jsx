"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/changelog-trace";
import * as dependency5 from "./830174.jsx";
("use strict");
var t = dependency0;
function x(props) {
  return dependency1.createElement(dependency4.ChangelogTrace, props);
}
var f = dependency5;
export default (function () {
  return (0, t.jsx)("div", {
    className: "w-full max-w-[720px] py-4",
    children: (0, t.jsx)(x, { entries: f.ENTRIES, initialCount: 4 }),
  });
});
