"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency5 from "../../../registry/components/hover-card";
import * as dependency6 from "../../../registry/components/avatar";
import * as dependency7 from "../../../registry/components/button";
("use strict");
var t = dependency0;
var r = dependency1;
function s(props) {
  return dependency1.createElement(dependency5.HoverCard, props);
}
var a = dependency6;
var l = dependency7;
export default (function ({ tab: e = "Profile" }) {
  let [n, i] = r.useState(!1);
  return "Link" === e
    ? (0, t.jsxs)("p", {
        className:
          "max-w-[320px] text-[13.5px] leading-relaxed text-muted-foreground",
        children: [
          "The fix landed in",
          " ",
          (0, t.jsx)(s, {
            width: 280,
            content: (0, t.jsxs)("div", {
              className: "flex flex-col gap-2",
              children: [
                (0, t.jsxs)("span", {
                  className:
                    "flex items-center gap-2 text-[12px] text-muted-foreground",
                  children: [
                    (0, t.jsx)("span", {
                      className: "size-2 rounded-full bg-emerald-500",
                    }),
                    " Merged · relay-web",
                  ],
                }),
                (0, t.jsx)("p", {
                  className: "font-medium text-foreground",
                  children: "Keep the composer open when a reply streams in",
                }),
                (0, t.jsx)("p", {
                  className: "text-[12.5px] text-muted-foreground",
                  children: "+42 −18 · reviewed by Priya",
                }),
              ],
            }),
            children: (0, t.jsx)("a", {
              href: "#",
              className:
                "font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground",
              children: "#482",
            }),
          }),
          " ",
          "yesterday.",
        ],
      })
    : (0, t.jsxs)("p", {
        className:
          "max-w-[320px] text-[13.5px] leading-relaxed text-muted-foreground",
        children: [
          "Design review with",
          " ",
          (0, t.jsx)(s, {
            content: (0, t.jsxs)("div", {
              className: "flex flex-col gap-3",
              children: [
                (0, t.jsxs)("div", {
                  className: "flex items-center gap-3",
                  children: [
                    (0, t.jsx)(a.Avatar, {
                      name: "Priya Nair",
                      src: "/demos/cavemio/ui-assets/avatar-cropper/priya.webp",
                      size: "lg",
                      status: "online",
                    }),
                    (0, t.jsxs)("div", {
                      className: "flex flex-col",
                      children: [
                        (0, t.jsx)("span", {
                          className: "font-medium text-foreground",
                          children: "Priya Nair",
                        }),
                        (0, t.jsx)("span", {
                          className: "text-[12.5px] text-muted-foreground",
                          children: "Design lead, Fernhill",
                        }),
                      ],
                    }),
                  ],
                }),
                (0, t.jsx)("p", {
                  className: "text-[13px] text-muted-foreground",
                  children: "Making forms people never notice. London.",
                }),
                (0, t.jsx)(l.Button, {
                  size: "sm",
                  variant: n ? "outline" : "primary",
                  onClick: () => i((e) => !e),
                  children: n ? "Following" : "Follow",
                }),
              ],
            }),
            children: (0, t.jsx)("a", {
              href: "#",
              className:
                "font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground",
              children: "@priya",
            }),
          }),
          " ",
          "at three.",
        ],
      });
});
