"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/usage-limits";
("use strict");
var t = dependency0;
var s = dependency1;
function p(props) {
  return dependency1.createElement(dependency4.UsageLimits, props);
}
export default (function ({ tab: e = "Normal" }) {
  let a,
    [n] = (0, s.useState)(() => Date.now()),
    r = "Reached" === e ? 1 : "Near the limit" === e ? 0.86 : 0.38,
    i =
      ((a = new Date(n)).setDate(a.getDate() + ((9 - a.getDay()) % 7 || 7)),
      a.setHours(15, 0, 0, 0),
      a.getTime());
  return (0, t.jsx)("div", {
    className: "w-full max-w-[440px] py-4",
    children: (0, t.jsx)(
      p,
      {
        plan: "Max",
        defaultOpen: "Near the limit" === e,
        context: {
          limit: 1e6,
          parts: [
            { id: "system", label: "System prompt", tokens: 14e3 },
            { id: "tools", label: "Tools", tokens: 46e3 },
            {
              id: "files",
              label: "Files read",
              tokens: "Normal" === e ? 212e3 : 318e3,
            },
            {
              id: "chat",
              label: "Conversation",
              tokens: "Normal" === e ? 298e3 : 548e3,
            },
          ],
        },
        limits: [
          {
            id: "five-hour",
            label: "5-hour window",
            used: 100 * r,
            limit: 100,
            resetsAt: n + 72e5 + 276e4,
          },
          {
            id: "weekly",
            label: "Weekly · all models",
            used: "Normal" === e ? 3 : 41,
            limit: 100,
            resetsAt: i,
          },
          {
            id: "think",
            label: "Weekly · Aurora Think",
            used: "Reached" === e ? 100 : 5,
            limit: 100,
            resetsAt: i,
          },
        ],
        onPlanClick: () => {},
        locales: "en-US",
      },
      e,
    ),
  });
});
