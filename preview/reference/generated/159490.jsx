"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/combo-chart";
("use strict");
var t = dependency0;
function c(props) {
  return dependency1.createElement(dependency4.ComboChart, props);
}
let m = [
  96, 104, 131, 142, 88, 84, 90, 99, 112, 138, 129, 81, 52, 85, 92, 101, 124,
  133, 79, 77, 83, 88, 97, 119, 126, 74, 72, 79, 84, 93,
].map((e, t) => {
  let r = new Date("2026-09-10T12:00:00");
  return (
    r.setDate(r.getDate() + t),
    {
      key: r.toISOString().slice(0, 10),
      label: r.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      title: r.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
      value: e,
    }
  );
});
export default (function () {
  return (0, t.jsx)("div", {
    className: "w-full max-w-[680px] py-4",
    children: (0, t.jsx)(c, {
      title: "Orders",
      days: m,
      previous: 3212,
      series: ["Orders", "7-day average"],
      locales: "en-US",
    }),
  });
});
