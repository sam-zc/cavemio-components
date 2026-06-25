"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/changelog-timeline";
("use strict");
var t = dependency0;
function h(props) {
  return dependency1.createElement(dependency4.ChangelogTimeline, props);
}
let x = [
  {
    id: "shift-planner",
    date: "2026-10-06",
    version: "v2.8",
    title: "Shift planner",
    tags: ["new"],
    body: (0, t.jsx)("p", {
      children:
        "Drag shifts onto the week and Kept checks them against your busiest hours. Ana and Tom get their rota on their phones the moment you publish it.",
    }),
    media: (0, t.jsx)("div", {
      className: "grid grid-cols-5 gap-1.5 bg-muted/50 p-4 text-[11px]",
      children: ["Mon", "Tue", "Wed", "Thu", "Fri"].map((e, r) =>
        (0, t.jsxs)(
          "div",
          {
            className: "rounded-[10px] border border-border bg-background p-2",
            children: [
              (0, t.jsx)("p", {
                className: "text-muted-foreground",
                children: e,
              }),
              (0, t.jsx)("p", {
                className:
                  "mt-6 rounded-md bg-primary/10 px-1.5 py-1 font-medium text-primary",
                children: r % 2 ? "Ana" : "Tom",
              }),
            ],
          },
          e,
        ),
      ),
    }),
  },
  {
    id: "faster-checkout",
    date: "2026-09-29",
    version: "v2.7.2",
    title: "Checkout in one tap at the counter",
    tags: ["improved"],
    body: (0, t.jsx)("p", {
      children:
        "Returning customers pay with the card they used last time. The queue on a Saturday moves about a fifth faster in our tests.",
    }),
  },
  {
    id: "stock-alerts",
    date: "2026-09-22",
    version: "v2.7",
    title: "Stock alerts before a flavour runs out",
    tags: ["new"],
    body: (0, t.jsxs)("ul", {
      children: [
        (0, t.jsx)("li", {
          children: "A nudge when a tray is down to its last few scoops.",
        }),
        (0, t.jsx)("li", {
          children: "Suggested batch sizes from last month’s sales.",
        }),
      ],
    }),
  },
  {
    id: "receipt-fix",
    date: "2026-09-15",
    version: "v2.6.4",
    title: "Receipts print the right shop name again",
    tags: ["fixed"],
    body: (0, t.jsx)("p", {
      children:
        "Shops with more than one location sometimes printed the first shop’s address. Sorry, Harbour Road.",
    }),
  },
  {
    id: "dark-mode",
    date: "2026-09-08",
    version: "v2.6",
    title: "Dark mode for the counter screen",
    tags: ["new", "improved"],
    body: (0, t.jsx)("p", {
      children:
        "Easier on the eyes at closing time, and it follows the screen’s own setting.",
    }),
  },
  {
    id: "export",
    date: "2026-08-30",
    version: "v2.5.1",
    title: "Exports include tips",
    tags: ["improved"],
    body: (0, t.jsx)("p", {
      children: "The weekly CSV now has a tips column, split by shift.",
    }),
  },
  {
    id: "sync-fix",
    date: "2026-08-21",
    version: "v2.5",
    title: "Offline orders sync without duplicates",
    tags: ["fixed"],
    body: (0, t.jsx)("p", {
      children:
        "Orders taken while the Wi-Fi dropped could appear twice once it came back. They now sync once, in order.",
    }),
  },
];
export const ENTRIES = x;
export default (function () {
  return (0, t.jsx)("div", {
    className: "w-full max-w-[720px] py-4",
    children: (0, t.jsx)(h, { entries: x, initialCount: 4 }),
  });
});
