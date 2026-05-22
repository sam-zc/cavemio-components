"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../icon-factory";
import * as dependency3 from "lucide-react";
import * as dependency7 from "../../../registry/components/popover";
import * as dependency8 from "../../../registry/components/button";
import * as dependency9 from "../../../registry/components/input";
("use strict");
var t = dependency0;
var r = dependency1;
let n = (0, dependency2.default)("Info", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }],
]);
var i = dependency3;
function l(props) {
  return dependency1.createElement(dependency7.Popover, props);
}
var d = dependency8;
var c = dependency9;
export default (function ({ tab: e = "Form" }) {
  let [s, o] = r.useState("Q3 launch plan");
  return "Details" === e
    ? (0, t.jsxs)("div", {
        className: "flex items-center gap-2 text-[13.5px] text-foreground",
        children: [
          "All access",
          (0, t.jsxs)(l, {
            label: "About All access",
            width: 260,
            trigger: (0, t.jsx)(d.Button, {
              variant: "ghost",
              size: "icon",
              "aria-label": "About All access",
              className: "size-7",
              children: (0, t.jsx)(n, { size: 14 }),
            }),
            children: [
              (0, t.jsx)("p", {
                className: "font-medium",
                children: "Every template, every update",
              }),
              (0, t.jsx)("p", {
                className:
                  "mt-1 text-[13px] leading-relaxed text-muted-foreground",
                children:
                  "One payment of $149. New templates land in your account as they ship, with the source.",
              }),
            ],
          }),
        ],
      })
    : (0, t.jsxs)("div", {
        className:
          "flex items-center gap-3 rounded-full bg-card py-1.5 pl-4 pr-1.5 shadow-[inset_0_0_0_1px_var(--border)]",
        children: [
          (0, t.jsx)("span", {
            className: "text-[13.5px] font-medium text-foreground",
            children: s,
          }),
          (0, t.jsx)(l, {
            label: "Rename",
            trigger: (0, t.jsx)(d.Button, {
              variant: "ghost",
              size: "icon",
              "aria-label": "Rename",
              className: "size-7",
              children: (0, t.jsx)(i.Pencil, { size: 13 }),
            }),
            children: ({ close: e }) =>
              (0, t.jsxs)("form", {
                className: "flex flex-col gap-3",
                onSubmit: (t) => {
                  t.preventDefault();
                  let r = new FormData(t.currentTarget).get("name");
                  ("string" == typeof r && r.trim() && o(r.trim()), e());
                },
                children: [
                  (0, t.jsx)(c.Input, {
                    name: "name",
                    label: "Name",
                    defaultValue: s,
                    size: "sm",
                  }),
                  (0, t.jsxs)("div", {
                    className: "flex justify-end gap-2",
                    children: [
                      (0, t.jsx)(d.Button, {
                        type: "button",
                        variant: "ghost",
                        size: "sm",
                        onClick: e,
                        children: "Cancel",
                      }),
                      (0, t.jsx)(d.Button, {
                        type: "submit",
                        size: "sm",
                        children: "Save",
                      }),
                    ],
                  }),
                ],
              }),
          }),
        ],
      });
});
