"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/sheet";
import * as dependency5 from "../../../registry/components/button";
import * as dependency6 from "../../../registry/components/checkbox";
import * as dependency7 from "../../../registry/components/slider";
("use strict");
var t = dependency0;
function o(props) {
  return dependency1.createElement(dependency4.Sheet, props);
}
var a = dependency5;
var l = dependency6;
var c = dependency7;
let d = [
  ["Order", "#4182"],
  ["Customer", "Ada Okafor"],
  ["Placed", "Today, 09:41"],
  ["Items", "2 × Pistachio, 1 × Sour cherry"],
  ["Total", "£14.50"],
];
export default (function ({ tab: e = "Right" }) {
  return "Bottom" === e
    ? (0, t.jsx)(o, {
        side: "bottom",
        trigger: (0, t.jsx)(a.Button, {
          variant: "outline",
          children: "Filters",
        }),
        title: "Filters",
        description: "Pull the sheet down to close it.",
        footer: ({ close: e }) =>
          (0, t.jsx)(a.Button, { onClick: e, children: "Show 32 results" }),
        children: (0, t.jsxs)("div", {
          className: "flex flex-col gap-5 pt-2",
          children: [
            (0, t.jsx)(c.Slider, {
              label: "Price",
              min: 0,
              max: 20,
              defaultValue: [2, 12],
              format: (e) => `\xa3${e}`,
            }),
            (0, t.jsxs)("div", {
              className: "flex flex-col gap-3",
              children: [
                (0, t.jsx)(l.Checkbox, {
                  label: "Dairy free",
                  defaultChecked: !0,
                }),
                (0, t.jsx)(l.Checkbox, { label: "Nut free" }),
                (0, t.jsx)(l.Checkbox, {
                  label: "In stock today",
                  defaultChecked: !0,
                }),
              ],
            }),
          ],
        }),
      })
    : (0, t.jsx)(o, {
        trigger: (0, t.jsx)(a.Button, {
          variant: "outline",
          children: "Open order",
        }),
        title: "Order #4182",
        description: "Drag the header to the right to close.",
        footer: ({ close: e }) =>
          (0, t.jsxs)(t.Fragment, {
            children: [
              (0, t.jsx)(a.Button, {
                variant: "ghost",
                onClick: e,
                children: "Close",
              }),
              (0, t.jsx)(a.Button, {
                onClick: e,
                children: "Mark as collected",
              }),
            ],
          }),
        children: (0, t.jsx)("dl", {
          className: "flex flex-col divide-y divide-border",
          children: d.map(([e, r]) =>
            (0, t.jsxs)(
              "div",
              {
                className: "flex justify-between gap-4 py-3",
                children: [
                  (0, t.jsx)("dt", {
                    className: "text-muted-foreground",
                    children: e,
                  }),
                  (0, t.jsx)("dd", {
                    className: "text-right text-foreground",
                    children: r,
                  }),
                ],
              },
              e,
            ),
          ),
        }),
      });
});
