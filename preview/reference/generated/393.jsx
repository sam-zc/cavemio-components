"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency3 from "../../../registry/components/alert";
import * as dependency4 from "../../../registry/components/button";
("use strict");
var r = dependency0;
var t = dependency1;
function a(props) {
  return dependency1.createElement(dependency3.Alert, props);
}
var c = dependency4;
export default (function ({ tab: e = "Tones" }) {
  let [i, n] = t.useState(!1),
    [s, o] = t.useState(!0);
  return "Sync" === e
    ? (0, r.jsxs)("div", {
        className: "flex w-full max-w-[380px] flex-col items-center gap-4",
        children: [
          (0, r.jsx)(a, {
            tone: i ? "success" : "info",
            title: i ? "Synced with Stripe" : "Syncing with Stripe",
            children: i
              ? "1,284 invoices are up to date."
              : "This takes a minute; you can keep working.",
          }),
          (0, r.jsx)(c.Button, {
            variant: "outline",
            size: "sm",
            onClick: () => n((e) => !e),
            children: i ? "Sync again" : "Finish sync",
          }),
        ],
      })
    : "Dismiss" === e
      ? (0, r.jsxs)("div", {
          className: "flex w-full max-w-[380px] flex-col gap-3",
          children: [
            (0, r.jsx)(
              a,
              {
                tone: "warning",
                title: "Your card expires on 30 November",
                onDismiss: () => window.setTimeout(() => o((e) => !e), 1200),
                action: (0, r.jsx)(c.Button, {
                  size: "sm",
                  children: "Update",
                }),
                children: "Update it to keep All access.",
              },
              String(s),
            ),
            (0, r.jsx)("div", {
              className:
                "rounded-[14px] bg-card p-3.5 text-[13px] text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)]",
              children: "Billing history slides up when the alert goes.",
            }),
          ],
        })
      : (0, r.jsxs)("div", {
          className: "flex w-full max-w-[380px] flex-col gap-3",
          children: [
            (0, r.jsx)(a, {
              title: "Northwind invited you to their workspace",
              action: (0, r.jsx)(c.Button, {
                size: "sm",
                variant: "outline",
                children: "View",
              }),
            }),
            (0, r.jsx)(a, {
              tone: "success",
              title: "Payment received",
              children: "£149 for All access. A receipt is on its way.",
            }),
            (0, r.jsx)(a, {
              tone: "danger",
              title: "The deploy failed",
              children: "Build step exited with code 1 after 42s.",
            }),
          ],
        });
});
