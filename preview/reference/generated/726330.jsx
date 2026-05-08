"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/announcement-pill";
("use strict");
var t = dependency0;
function l(props) {
  return dependency1.createElement(dependency2.AnnouncementPill, props);
}
let d = [
  {
    date: "Oct 8",
    title: "Agents hand off to each other",
    text: "One agent plans, another ships, and you approve the handover.",
  },
  {
    date: "Sep 30",
    title: "Workflows run on a schedule",
    text: "Every Monday at 9, or the moment a form comes in.",
  },
  {
    date: "Sep 18",
    title: "Faster first deploy",
    text: "From sign-up to live in under a minute.",
  },
];
function c() {
  return (0, t.jsxs)("div", {
    className: "p-5",
    children: [
      (0, t.jsx)("p", {
        className: "text-[12px] font-medium text-muted-foreground",
        children: "What’s new",
      }),
      (0, t.jsx)("ol", {
        className: "mt-3 space-y-3.5",
        children: d.map((e) =>
          (0, t.jsxs)(
            "li",
            {
              className: "grid grid-cols-[52px_1fr] gap-2",
              children: [
                (0, t.jsx)("span", {
                  className:
                    "pt-px font-mono text-[11px] text-muted-foreground",
                  children: e.date,
                }),
                (0, t.jsxs)("span", {
                  children: [
                    (0, t.jsx)("span", {
                      className:
                        "block text-[13px] font-medium text-foreground",
                      children: e.title,
                    }),
                    (0, t.jsx)("span", {
                      className:
                        "mt-0.5 block text-[12px] leading-snug text-muted-foreground",
                      children: e.text,
                    }),
                  ],
                }),
              ],
            },
            e.title,
          ),
        ),
      }),
      (0, t.jsx)("a", {
        href: "#",
        onClick: (e) => e.preventDefault(),
        className:
          "mt-4 inline-flex items-center gap-1 rounded text-[12.5px] font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground",
        children: "See all updates",
      }),
    ],
  });
}
export default (function () {
  return (0, t.jsxs)("div", {
    className:
      "flex min-h-[320px] w-full flex-col items-center pt-6 text-center",
    children: [
      (0, t.jsx)(l, {
        more: "Read the changelog",
        card: (0, t.jsx)(c, {}),
        children: "Agents can now hand off",
      }),
      (0, t.jsxs)("p", {
        className:
          "mt-6 text-[38px] font-medium leading-[1.05] tracking-[-0.04em] text-foreground",
        children: ["Ship the launch page", (0, t.jsx)("br", {}), "tonight."],
      }),
      (0, t.jsx)("p", {
        className: "mt-3 text-[14px] text-muted-foreground",
        children: "Point at the pill, then open it.",
      }),
    ],
  });
});
