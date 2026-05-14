"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/dialog";
import * as dependency5 from "../../../registry/components/button";
("use strict");
var t = dependency0;
var n = dependency1;
function o(props) {
  return dependency1.createElement(dependency4.Dialog, props);
}
var a = dependency5;
export default (function ({ tab: e = "Confirm" }) {
  let [r, i] = n.useState("idle"),
    [s, l] = n.useState(!1);
  return "Long" === e
    ? (0, t.jsx)(o, {
        trigger: (0, t.jsx)(a.Button, {
          variant: "outline",
          children: "Read the licence",
        }),
        title: "Template licence",
        description: "Plain English, about two minutes.",
        footer: ({ close: e }) =>
          (0, t.jsx)(a.Button, { onClick: e, children: "Got it" }),
        children: (0, t.jsx)("div", {
          className: "flex flex-col gap-3 text-muted-foreground",
          children: [
            "You can use a template for any number of your own projects and client projects.",
            "You can change it as much as you like, and you don't have to credit us.",
            "You can't resell or give away the template itself, changed or not, as a template.",
            "Updates are included for as long as the template is on sale.",
            "If something in it doesn't work as described, tell us and we'll fix it or refund you.",
            "Fonts and photos keep their own licences, listed in ASSETS.md in each download.",
            "Questions go to support@example.com; a person answers.",
          ].map((e) => (0, t.jsx)("p", { children: e }, e)),
        }),
      })
    : (0, t.jsx)(o, {
        open: s,
        onOpenChange: (e) => {
          (l(e), e && i("idle"));
        },
        trigger: (0, t.jsx)(a.Button, {
          variant: "destructive",
          children: "Delete project",
        }),
        size: "sm",
        title: "Delete Northwind?",
        description:
          "Its 14 pages and every deploy go with it. This can't be undone.",
        footer: ({ close: e }) =>
          (0, t.jsxs)(t.Fragment, {
            children: [
              (0, t.jsx)(a.Button, {
                variant: "ghost",
                onClick: e,
                children: "Cancel",
              }),
              (0, t.jsx)(a.Button, {
                variant: "destructive",
                status: r,
                statusLabels: {
                  idle: "Delete project",
                  pending: "Deleting",
                  success: "Deleted",
                },
                onClick: () => {
                  (i("pending"),
                    window.setTimeout(() => {
                      (i("success"), window.setTimeout(e, 700));
                    }, 900));
                },
                children: "Delete project",
              }),
            ],
          }),
      });
});
