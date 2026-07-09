"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency5 from "../../../registry/components/cron-input";
import * as dependency6 from "../../../registry/components/status-button";
import * as dependency7 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
function V(props) {
  return dependency1.createElement(dependency5.CronInput, props);
}
var X = dependency6;
var G = dependency7;
let q = {
  Cron: {
    title: "Send the weekly digest",
    detail: "jobs/digest.ts · Relay workers",
    value: "0 9 * * 1-5",
  },
  "Plain English": {
    title: "Sync Stripe payouts",
    detail: "jobs/payouts.ts · Relay workers",
    value: "every 15 minutes from 9am to 5pm on weekdays",
  },
  "Time zones": {
    title: "Back up the database",
    detail: "jobs/backup.ts · Relay workers",
    value: "30 1 * * 0",
    zone: "Europe/London",
    zones: [
      "UTC",
      "Europe/London",
      "America/New_York",
      "Asia/Kolkata",
      "Australia/Sydney",
    ],
  },
};
export default (function ({ tab: e = "Cron" }) {
  let n = q[e] ?? q.Cron,
    [a, s] = r.default.useState("idle");
  return (0, t.jsx)("div", {
    style: (0, G.demoAppearance)(),
    className: "w-full max-w-[460px] text-foreground",
    children: (0, t.jsxs)("div", {
      className: "rounded-[22px] border border-border bg-background p-4 sm:p-5",
      children: [
        (0, t.jsxs)("div", {
          className: "mb-3.5",
          children: [
            (0, t.jsx)("p", {
              className: "text-[14px] font-medium tracking-[-0.01em]",
              children: n.title,
            }),
            (0, t.jsx)("p", {
              className:
                "mt-0.5 truncate font-mono text-[11px] text-muted-foreground",
              children: n.detail,
            }),
          ],
        }),
        (0, t.jsx)(
          V,
          {
            label: `Schedule for ${n.title.toLowerCase()}`,
            defaultValue: n.value,
            defaultTimeZone: n.zone ?? "UTC",
            timeZones: n.zones,
            onValueChange: () => s("idle"),
            onTimeZoneChange: () => s("idle"),
          },
          e,
        ),
        (0, t.jsxs)("div", {
          className: "mt-4 flex items-center justify-between gap-3",
          children: [
            (0, t.jsx)("p", {
              className: "text-[12px] text-muted-foreground",
              children: "Missed runs catch up once.",
            }),
            (0, t.jsx)(X.StatusButton, {
              status: a,
              labels: {
                idle: "Save schedule",
                pending: "Saving",
                success: "Saved",
                error: "Try again",
              },
              onClick: () => {
                "pending" !== a &&
                  (s("pending"), setTimeout(() => s("success"), 900));
              },
              onReset: () => s("idle"),
            }),
          ],
        }),
      ],
    }),
  });
});
