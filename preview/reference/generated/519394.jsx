"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency5 from "../../../registry/components/progress";
import * as dependency6 from "../../../registry/components/button";
("use strict");
var r = dependency0;
var t = dependency1;
function o(props) {
  return dependency1.createElement(dependency5.Progress, props);
}
var l = dependency6;
export default (function ({ tab: e = "Upload" }) {
  let [n, i] = t.useState(0),
    [s, a] = t.useState(!1),
    d = s && n < 100;
  t.useEffect(() => {
    if (!d) return;
    let e = window.setInterval(
      () => i((e) => Math.min(100, e + 6 + Math.round(14 * Math.random()))),
      450,
    );
    return () => window.clearInterval(e);
  }, [d]);
  let c = () => {
    (i(0), a(!0));
  };
  return "Unknown" === e
    ? (0, r.jsx)("div", {
        className: "w-full max-w-[320px]",
        children: (0, r.jsx)(o, { label: "Preparing your export" }),
      })
    : "Ring" === e
      ? (0, r.jsxs)("div", {
          className: "flex flex-col items-center gap-5",
          children: [
            (0, r.jsxs)("div", {
              className: "flex items-center gap-5",
              children: [
                (0, r.jsx)(o, { variant: "ring", value: n, label: "Upload" }),
                (0, r.jsx)(o, {
                  variant: "ring",
                  value: 72,
                  size: 56,
                  label: "Storage",
                }),
                (0, r.jsx)(o, { variant: "ring", label: "Working" }),
              ],
            }),
            (0, r.jsx)(l.Button, {
              variant: "outline",
              size: "sm",
              onClick: c,
              children: "Upload",
            }),
          ],
        })
      : (0, r.jsxs)("div", {
          className: "flex w-full max-w-[320px] flex-col items-center gap-5",
          children: [
            (0, r.jsx)(o, {
              label: "Uploading northwind-brief.pdf",
              doneLabel: "Uploaded northwind-brief.pdf",
              value: n,
            }),
            (0, r.jsx)(l.Button, {
              variant: "outline",
              size: "sm",
              onClick: c,
              children: n >= 100 ? "Upload again" : "Upload",
            }),
          ],
        });
});
