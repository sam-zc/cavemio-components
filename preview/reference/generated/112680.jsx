"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/onboarding-checklist";
("use strict");
var t = dependency0;
var n = dependency1;
function m(props) {
  return dependency1.createElement(dependency4.OnboardingChecklist, props);
}
let p = (e) => new Promise((t) => window.setTimeout(t, e));
let h = [
  {
    id: "menu",
    title: "Add your menu",
    description: "Flavours, sizes and prices, so orders know what they can be.",
    action: {
      label: "Import menu",
      pendingLabel: "Importing",
      onClick: () => p(1100),
    },
  },
  {
    id: "hours",
    title: "Set opening hours",
    description:
      "Customers see them on your page; orders close fifteen minutes before.",
    action: {
      label: "Use usual hours",
      pendingLabel: "Saving",
      onClick: () => p(800),
    },
  },
  {
    id: "payments",
    title: "Connect payments",
    description:
      "Card and Apple Pay at the counter and online. Payouts every morning.",
    action: {
      label: "Connect",
      pendingLabel: "Connecting",
      onClick: () => p(1300),
    },
  },
  {
    id: "team",
    title: "Invite your team",
    description: "Ana and Tom can take orders; only you see the takings.",
    action: {
      label: "Send invites",
      pendingLabel: "Sending",
      onClick: () => p(900),
    },
  },
  {
    id: "test",
    title: "Take a test order",
    description:
      "One scoop of pistachio, end to end, so Saturday holds no surprises.",
    action: {
      label: "Place test order",
      pendingLabel: "Placing",
      onClick: () => p(1200),
    },
  },
];
function f({ tasks: e, preset: r }) {
  let [s, i] = n.default.useState(
      () => new Set(e.slice(0, r).map((e) => e.id)),
    ),
    [o, a] = n.default.useState(!1);
  return o
    ? (0, t.jsx)("button", {
        type: "button",
        onClick: () => (i(new Set()), a(!1)),
        className:
          "cursor-pointer text-[12.5px] text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground",
        children: "Start the checklist again",
      })
    : (0, t.jsx)(m, {
        tasks: e.map((e) => ({ ...e, done: s.has(e.id) })),
        onTaskComplete: (e) => i((t) => new Set(t).add(e)),
        onDismiss: () => a(!0),
      });
}
export default (function ({ tab: e = "Fresh" }) {
  return (0, t.jsx)("div", {
    className: "w-full max-w-[400px]",
    children: (0, t.jsx)(f, { tasks: h, preset: 3 * ("Nearly done" === e) }, e),
  });
});
