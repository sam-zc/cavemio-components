"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../icon-factory";
import * as dependency3 from "../../../registry/components/input";
("use strict");
var r = dependency0;
var t = dependency1;
let n = (0, dependency2.default)("AtSign", [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8", key: "7n84p3" }],
]);
var s = dependency3;
export default (function ({ tab: e = "Fields" }) {
  let [a, i] = t.useState("ada@fernhill"),
    [l, o] = t.useState(!1),
    d = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a);
  return "Error" === e
    ? (0, r.jsxs)("form", {
        noValidate: !0,
        className: "flex w-full max-w-[320px] flex-col gap-3",
        onSubmit: (e) => {
          (e.preventDefault(), o(!0));
        },
        children: [
          (0, r.jsx)(s.Input, {
            label: "Email",
            value: a,
            onValueChange: i,
            leading: (0, r.jsx)(n, {}),
            clearable: !0,
            hint: "We send the receipt here.",
            error:
              l && !d ? "That address is missing its domain, like .co" : void 0,
          }),
          (0, r.jsx)("button", {
            type: "submit",
            className:
              "h-9 self-start rounded-full bg-primary px-4 text-[13px] font-medium text-primary-foreground cursor-pointer transition-[scale] duration-200 active:scale-[0.97]",
            children: "Continue",
          }),
        ],
      })
    : "Sizes" === e
      ? (0, r.jsxs)("div", {
          className: "flex w-full max-w-[320px] flex-col gap-3",
          children: [
            (0, r.jsx)(s.Input, {
              size: "sm",
              placeholder: "Filter rows",
              clearable: !0,
              "aria-label": "Filter rows",
            }),
            (0, r.jsx)(s.Input, {
              placeholder: "Northwind Traders",
              clearable: !0,
              "aria-label": "Company",
            }),
          ],
        })
      : (0, r.jsxs)("div", {
          className: "flex w-full max-w-[320px] flex-col gap-4",
          children: [
            (0, r.jsx)(s.Input, {
              label: "Workspace name",
              defaultValue: "Fernhill",
              clearable: !0,
              hint: "Shown on invoices and invites.",
            }),
            (0, r.jsx)(s.Input, {
              label: "Website",
              placeholder: "fernhill",
              leading: (0, r.jsx)("span", {
                className: "text-[13px]",
                children: "https://",
              }),
              trailing: (0, r.jsx)("span", {
                className: "pr-2.5 text-[13px]",
                children: ".com",
              }),
            }),
          ],
        });
});
