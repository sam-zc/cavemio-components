"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency5 from "../../../registry/components/empty-state";
("use strict");
var t = dependency0;
var r = dependency1;
function _(props) {
  return dependency1.createElement(dependency5.EmptyState, props);
}
let S = (e) => new Promise((t) => window.setTimeout(t, e));
let N = [
  "Relay onboarding",
  "Kept spring menu",
  "Northwind invoices",
  "Fernhill launch",
  "Pricing page refresh",
];
function $({ title: e, aside: r, children: n }) {
  return (0, t.jsxs)("div", {
    className:
      "w-full max-w-[420px] overflow-hidden rounded-[18px] bg-card shadow-[inset_0_0_0_1px_var(--border)]",
    children: [
      (0, t.jsxs)("div", {
        className:
          "flex h-12 items-center justify-between gap-3 border-b border-border px-4",
        children: [
          (0, t.jsx)("span", {
            className: "text-[13.5px] font-medium text-foreground",
            children: e,
          }),
          r,
        ],
      }),
      n,
    ],
  });
}
function E({ children: e, meta: r }) {
  return (0, t.jsxs)("li", {
    className:
      "flex h-11 items-center justify-between gap-3 border-b border-border px-4 text-[13px] text-foreground last:border-b-0 motion-safe:animate-[ui-empty-in_360ms_cubic-bezier(0.16,1,0.3,1)_backwards]",
    children: [
      (0, t.jsx)("span", { className: "min-w-0 truncate", children: e }),
      r &&
        (0, t.jsx)("span", {
          className: "shrink-0 text-[12px] tabular-nums text-muted-foreground",
          children: r,
        }),
    ],
  });
}
function T() {
  let [e, n] = r.useState([]);
  return e.length
    ? (0, t.jsx)($, {
        title: "Projects",
        children: (0, t.jsx)("ul", {
          children: e.map((e) =>
            (0, t.jsx)(E, { meta: "Just now", children: e }, e),
          ),
        }),
      })
    : (0, t.jsx)($, {
        title: "Projects",
        children: (0, t.jsx)(_, {
          scene: "inbox",
          title: "No projects yet",
          description:
            "Projects keep a launch's pages, copy and checklists together. Start one and invite your team.",
          action: {
            label: "Create project",
            pendingLabel: "Creating",
            successLabel: "Created",
            onAction: async () => {
              (await S(1100),
                window.setTimeout(() => n(["Untitled project"]), 1300));
            },
          },
          secondaryAction: { label: "Import from CSV" },
        }),
      });
}
function M() {
  let [e, n] = r.useState("refunds"),
    s = N.filter((t) => t.toLowerCase().includes(e.trim().toLowerCase()));
  return (0, t.jsx)($, {
    title: "Projects",
    aside: (0, t.jsx)("input", {
      value: e,
      onChange: (e) => n(e.target.value),
      placeholder: "Search",
      "aria-label": "Search projects",
      className:
        "h-8 w-40 min-w-0 rounded-full bg-transparent px-3 text-[13px] text-foreground shadow-[inset_0_0_0_1px_var(--border)] outline-none placeholder:text-muted-foreground focus-visible:shadow-[inset_0_0_0_1px_var(--ring)]",
    }),
    children: s.length
      ? (0, t.jsx)("ul", {
          children: s.map((e) => (0, t.jsx)(E, { children: e }, e)),
        })
      : (0, t.jsx)(_, {
          scene: "search",
          title: `No results for “${e.trim()}”`,
          description:
            "Check the spelling, or search by a project's owner or tag instead.",
          secondaryAction: { label: "Clear search", onAction: () => n("") },
          children: ["Relay", "Kept", "launch"].map((e) =>
            (0, t.jsx)(
              "button",
              {
                type: "button",
                onClick: () => n(e),
                className:
                  "h-7 cursor-pointer rounded-full px-3 text-[12.5px] text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)] transition-colors hover:bg-accent hover:text-foreground",
                children: e,
              },
              e,
            ),
          ),
        }),
  });
}
function R() {
  let [e, n] = r.useState("offline"),
    s = r.useRef(0);
  return "events" === e
    ? (0, t.jsx)($, {
        title: "Events",
        aside: (0, t.jsx)("span", {
          className: "text-[12px] text-emerald-600 dark:text-emerald-400",
          children: "Live",
        }),
        children: (0, t.jsx)("ul", {
          children: (0, t.jsx)(E, {
            meta: "0.2s ago",
            children: "test.event · Relay",
          }),
        }),
      })
    : (0, t.jsx)($, {
        title: "Events",
        children:
          "offline" === e
            ? (0, t.jsx)(_, {
                scene: "offline",
                title: "Can't reach Northwind's API",
                description:
                  "Events stop at the gateway. Check the endpoint's address, then try again.",
                action: {
                  label: "Retry",
                  pendingLabel: "Connecting",
                  successLabel: "Connected",
                  onAction: async () => {
                    if ((await S(1200), (s.current += 1), 1 === s.current))
                      throw Error(
                        "No answer from api.northwind.dev after 10 seconds.",
                      );
                    window.setTimeout(() => n("empty"), 1e3);
                  },
                },
                secondaryAction: { label: "Edit endpoint" },
              })
            : (0, t.jsx)(_, {
                scene: "chart",
                title: "No events yet",
                description:
                  "You're connected. Send a test event to see it arrive here, or wait for the first real one.",
                action: {
                  label: "Send a test event",
                  pendingLabel: "Sending",
                  successLabel: "Sent",
                  onAction: async () => {
                    (await S(1e3), window.setTimeout(() => n("events"), 900));
                  },
                },
              }),
      });
}
function A() {
  let [e, n] = r.useState([
    "Reply to Fernhill about the launch date",
    "Approve the spring menu copy",
  ]);
  return (0, t.jsx)($, {
    title: "Inbox",
    aside: (0, t.jsxs)("span", {
      className: "text-[12px] tabular-nums text-muted-foreground",
      children: [e.length, " open"],
    }),
    children: e.length
      ? (0, t.jsx)("ul", {
          children: e.map((e) =>
            (0, t.jsxs)(
              "li",
              {
                className:
                  "flex h-11 items-center gap-3 border-b border-border px-4 text-[13px] text-foreground last:border-b-0",
                children: [
                  (0, t.jsx)("button", {
                    type: "button",
                    "aria-label": `Done: ${e}`,
                    onClick: () => n((t) => t.filter((t) => t !== e)),
                    className:
                      "size-4 shrink-0 cursor-pointer rounded-full shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--foreground)_22%,var(--border))] transition-colors hover:bg-accent",
                  }),
                  (0, t.jsx)("span", {
                    className: "min-w-0 truncate",
                    children: e,
                  }),
                ],
              },
              e,
            ),
          ),
        })
      : (0, t.jsx)(_, {
          scene: "done",
          title: "You're all caught up",
          description: "New mentions and requests will land here.",
          secondaryAction: { label: "View archive" },
        }),
  });
}
export default (function ({ tab: e = "First run" }) {
  return "No results" === e
    ? (0, t.jsx)(M, {})
    : "Connect" === e
      ? (0, t.jsx)(R, {})
      : "All done" === e
        ? (0, t.jsx)(A, {})
        : (0, t.jsx)(T, {});
});
