"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/changelog-scrubber";
import * as dependency5 from "./830174.jsx";
("use strict");
var n = dependency0;
function v(props) {
  return dependency1.createElement(dependency4.ChangelogScrubber, props);
}
var y = dependency5;
export default (function () {
  return (0, n.jsx)("div", {
    className: "w-full max-w-[640px] py-4",
    children: (0, n.jsx)(v, { entries: y.ENTRIES }),
  });
});
