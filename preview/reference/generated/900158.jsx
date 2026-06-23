"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "../../../registry/components/avatar";
("use strict");
var a = dependency0;
var s = dependency1;
let t = [
  {
    name: "Priya Nair",
    src: "/demos/cavemio/ui-assets/avatar-cropper/priya.webp",
  },
  {
    name: "Theo Brandt",
    src: "/demos/cavemio/ui-assets/avatar-cropper/theo.webp",
  },
  { name: "Ada Okafor" },
  { name: "Bram Visser" },
  { name: "Chen Wei" },
  { name: "Dara Byrne" },
  { name: "Elif Kaya" },
];
export default (function ({ tab: e = "People" }) {
  return "Group" === e
    ? (0, a.jsxs)("div", {
        className: "flex flex-col items-center gap-3",
        children: [
          (0, a.jsx)(s.AvatarGroup, { people: t, max: 4, size: "md" }),
          (0, a.jsx)("p", {
            className: "text-[12px] text-muted-foreground",
            children: "Point at the stack",
          }),
        ],
      })
    : (0, a.jsxs)("div", {
        className: "flex flex-col gap-3",
        children: [
          [
            { ...t[0], status: "online", role: "Design" },
            { ...t[1], status: "away", role: "Engineering" },
            { ...t[2], status: "busy", role: "Sales" },
          ].map((e) =>
            (0, a.jsxs)(
              "div",
              {
                className: "flex items-center gap-3",
                children: [
                  (0, a.jsx)(s.Avatar, {
                    name: e.name,
                    src: e.src,
                    status: e.status,
                  }),
                  (0, a.jsxs)("div", {
                    className: "flex flex-col",
                    children: [
                      (0, a.jsx)("span", {
                        className: "text-[13.5px] font-medium text-foreground",
                        children: e.name,
                      }),
                      (0, a.jsx)("span", {
                        className: "text-[12px] text-muted-foreground",
                        children: e.role,
                      }),
                    ],
                  }),
                ],
              },
              e.name,
            ),
          ),
          (0, a.jsxs)("div", {
            className: "flex items-center gap-2 pt-2",
            children: [
              (0, a.jsx)(s.Avatar, {
                name: "Fernhill",
                shape: "square",
                size: "sm",
              }),
              (0, a.jsx)(s.Avatar, {
                name: "Northwind Traders",
                shape: "square",
                size: "md",
              }),
              (0, a.jsx)(s.Avatar, {
                name: "Kept",
                shape: "square",
                size: "lg",
              }),
            ],
          }),
        ],
      });
});
