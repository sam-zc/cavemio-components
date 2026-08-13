"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/search-input";
("use strict");
var t = dependency0;
var r = dependency1;
function l(props) {
  return dependency1.createElement(dependency4.SearchInput, props);
}
let c = [
  "Ada Okafor",
  "Bram Visser",
  "Chen Wei",
  "Dara Byrne",
  "Elif Kaya",
  "Farah Malik",
  "Gus Moreno",
];
export default (function ({ tab: e = "Shortcut" }) {
  let [n, s] = r.useState(""),
    [i, a] = r.useState(!1),
    o = c.filter((e) => e.toLowerCase().includes(n.toLowerCase()));
  return (0, t.jsxs)("div", {
    className: "flex w-full max-w-[320px] flex-col gap-3",
    children: [
      (0, t.jsx)(l, {
        placeholder: "Search people",
        "aria-label": "Search people",
        shortcut: "Loading" === e ? "/" : "mod+k",
        loading: i,
        onSearch: (t) => {
          if ("Loading" !== e) return s(t);
          (a(!0),
            window.setTimeout(() => {
              (s(t), a(!1));
            }, 700));
        },
      }),
      (0, t.jsxs)("ul", {
        className: "flex flex-col gap-1 px-4 text-[13px] text-muted-foreground",
        children: [
          o.slice(0, 4).map((e) => (0, t.jsx)("li", { children: e }, e)),
          !o.length &&
            (0, t.jsxs)("li", { children: ["No one matches “", n, "”."] }),
        ],
      }),
    ],
  });
});
