"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency8 from "../../../registry/components/not-found";
("use strict");
var a = dependency0;
function g(props) {
  return dependency1.createElement(dependency8.NotFound, props);
}
let k = [
  { title: "Pricing", href: "#pricing", hint: "Plans for teams of every size" },
  {
    title: "Pricing for startups",
    href: "#startups",
    hint: "Half off for your first year",
  },
  { title: "Changelog", href: "#changelog", hint: "What shipped this month" },
  { title: "Docs: Getting started", href: "#docs", hint: "Docs · 4 min read" },
  { title: "Docs: Webhooks", href: "#webhooks", hint: "Docs · Integrations" },
  {
    title: "Careers",
    href: "#careers",
    hint: "We’re hiring in design and engineering",
  },
  { title: "Contact sales", href: "#sales", hint: "Talk to a person" },
];
export default (function ({ tab: e = "Search" }) {
  return (0, a.jsx)(
    g,
    {
      path: "/pricing-2024",
      links: k.slice(0, 3),
      search: async (a, s) => {
        if (
          (await new Promise((e, a) => {
            let t = setTimeout(e, 900);
            s.addEventListener(
              "abort",
              () => (
                clearTimeout(t),
                a(new DOMException("Aborted", "AbortError"))
              ),
            );
          }),
          "Offline" === e)
        )
          throw Error("Network error");
        let t = a.toLowerCase();
        return k.filter(
          (e) =>
            e.title.toLowerCase().includes(t) ||
            e.hint?.toLowerCase().includes(t),
        );
      },
    },
    e,
  );
});
