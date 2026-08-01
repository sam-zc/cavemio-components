"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "../icon-factory";
import * as dependency2 from "react";
import * as dependency5 from "../../../registry/components/newsletter-footer";
("use strict");
var t = dependency0;
var r = dependency1;
let n = (0, r.default)("Github", [
  [
    "path",
    {
      d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4",
      key: "tonef",
    },
  ],
  ["path", { d: "M9 18c-4.51 2-5-2-7-2", key: "9comsn" }],
]);
let s = (0, r.default)("Linkedin", [
  [
    "path",
    {
      d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
      key: "c2jq9f",
    },
  ],
  ["rect", { width: "4", height: "12", x: "2", y: "9", key: "mk3on5" }],
  ["circle", { cx: "4", cy: "4", r: "2", key: "bt5ra8" }],
]);
let a = (0, r.default)("Twitter", [
  [
    "path",
    {
      d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
      key: "pff0z6",
    },
  ],
]);
function y(props) {
  return dependency2.createElement(dependency5.NewsletterFooter, props);
}
export default (function () {
  return (0, t.jsx)("div", {
    className:
      "w-full max-w-[1040px] overflow-hidden rounded-[22px] border border-border",
    children: (0, t.jsx)(y, {
      className: "border-t-0",
      brand: {
        name: "Kept",
        tagline:
          "The till that knows your Saturdays. Orders, stock and rotas for small shops.",
        logo: (0, t.jsx)("span", {
          className:
            "grid size-6 place-items-center rounded-[7px] bg-primary text-[12px] font-semibold text-primary-foreground",
          children: "K",
        }),
      },
      newsletter: {
        onSubscribe: async (e) => {
          if (
            (await new Promise((e) => window.setTimeout(e, 1100)),
            e.includes("fail"))
          )
            throw Error("That address bounced last time. Try another?");
        },
      },
      columns: [
        {
          title: "Product",
          links: [
            { label: "Point of sale", href: "#" },
            { label: "Stock", href: "#" },
            { label: "Rotas", href: "#" },
            { label: "Changelog", href: "#", badge: "New" },
          ],
        },
        {
          title: "Company",
          links: [
            { label: "About", href: "#" },
            { label: "Customers", href: "#" },
            { label: "Careers", href: "#", badge: "Hiring" },
            { label: "Contact", href: "#" },
          ],
        },
        {
          title: "Help",
          links: [
            { label: "Help centre", href: "#" },
            { label: "Guides", href: "#" },
            { label: "API", href: "#" },
            { label: "Status", href: "#" },
          ],
        },
      ],
      legal: [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
        { label: "Cookie settings", onClick: () => {} },
      ],
      status: { state: "operational", href: "#" },
      socials: [
        { label: "Kept on GitHub", href: "#", icon: (0, t.jsx)(n, {}) },
        { label: "Kept on X", href: "#", icon: (0, t.jsx)(a, {}) },
        { label: "Kept on LinkedIn", href: "#", icon: (0, t.jsx)(s, {}) },
      ],
    }),
  });
});
