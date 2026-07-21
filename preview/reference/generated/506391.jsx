"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/number-roll";
import * as dependency7 from "../../../registry/components/kanban-board";
import * as dependency8 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
var i = dependency4;
function b(props) {
  return dependency1.createElement(dependency7.KanbanBoard, props);
}
var w = dependency8;
let k = [
  { id: "lead", title: "Lead", tone: 4 },
  { id: "qualified", title: "Qualified", tone: 1 },
  { id: "proposal", title: "Proposal", tone: 5 },
  { id: "won", title: "Won", tone: 3, done: !0 },
];
let $ = [
  {
    id: "d1",
    column: "lead",
    company: "Arbor Robotics",
    contact: "Ines Okafor",
    owner: "MC",
    amount: 8400,
    closes: "Nov 4",
  },
  {
    id: "d2",
    column: "lead",
    company: "Fjord Analytics",
    contact: "Kai Berg",
    owner: "LP",
    amount: null,
    closes: "Nov 18",
  },
  {
    id: "d3",
    column: "lead",
    company: "Meadow Farms",
    contact: "Ruth Adeyemi",
    owner: "AR",
    amount: 3200,
    closes: "Dec 2",
  },
  {
    id: "d4",
    column: "qualified",
    company: "Northwind Dairy",
    contact: "Tom Becker",
    owner: "MC",
    amount: 12400,
    closes: "Oct 30",
  },
  {
    id: "d5",
    column: "qualified",
    company: "Saltbox Games",
    contact: "Jonah Reyes",
    owner: "LP",
    amount: 6800,
    closes: "Nov 7",
  },
  {
    id: "d6",
    column: "qualified",
    company: "Vela Travel",
    contact: "Mei Tanaka",
    owner: "AR",
    amount: 4500,
    closes: "Nov 21",
  },
  {
    id: "d7",
    column: "proposal",
    company: "Halcyon Labs",
    contact: "Priya Nair",
    owner: "MC",
    amount: 18e3,
    closes: "Oct 24",
  },
  {
    id: "d8",
    column: "proposal",
    company: "Cobalt Energy",
    contact: "Dan Moreau",
    owner: "LP",
    amount: 22500,
    closes: "Oct 28",
  },
  {
    id: "d9",
    column: "won",
    company: "Brightwater",
    contact: "Sam Ortiz",
    owner: "AR",
    amount: 9600,
    closes: "Oct 9",
  },
];
let j = [
  { id: "todo", title: "Todo", tone: 2 },
  { id: "doing", title: "In progress", tone: 1 },
  { id: "review", title: "In review", tone: 4 },
  { id: "done", title: "Done", tone: 3, done: !0 },
];
let N = [
  {
    id: "i1",
    column: "todo",
    key: "REL-491",
    title: "Export invoices as CSV",
    owner: "LP",
  },
  {
    id: "i2",
    column: "todo",
    key: "REL-488",
    title: "Dark mode for the billing page",
    owner: "AR",
  },
  {
    id: "i3",
    column: "doing",
    key: "REL-482",
    title: "Checkout times out on slow networks",
    owner: "MC",
  },
  {
    id: "i4",
    column: "doing",
    key: "REL-479",
    title: "Seat changes don’t prorate",
    owner: "LP",
  },
  {
    id: "i5",
    column: "review",
    key: "REL-476",
    title: "Retry failed webhooks",
    owner: "AR",
  },
  {
    id: "i6",
    column: "done",
    key: "REL-470",
    title: "Invite teammates by email",
    owner: "MC",
  },
];
let S = { style: "currency", currency: "USD", maximumFractionDigits: 0 };
let E = 0;
function C({ initials: e }) {
  return (0, t.jsx)("span", {
    className:
      "flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)]",
    "aria-hidden": "true",
    children: e,
  });
}
function A({ tab: e }) {
  let [n, a] = r.default.useState($),
    o = r.default.useRef(!1),
    l =
      "Column limit" === e
        ? k.map((e) => ("proposal" === e.id ? { ...e, limit: 3 } : e))
        : k,
    s = n
      .filter((e) => "won" === e.column)
      .reduce((e, t) => e + (t.amount ?? 0), 0);
  return (0, t.jsxs)("div", {
    style: (0, w.demoAppearance)(),
    className: "w-full max-w-[1140px] text-foreground",
    children: [
      (0, t.jsxs)("div", {
        className: "mb-3 flex items-baseline justify-between gap-3 px-1",
        children: [
          (0, t.jsx)("p", {
            className: "text-[14px] font-medium tracking-[-0.01em]",
            children: "Q4 pipeline",
          }),
          (0, t.jsxs)("p", {
            className: "text-[11.5px] tabular-nums text-muted-foreground",
            children: [
              (0, t.jsx)(i.NumberRoll, {
                value: s,
                format: S,
                locales: "en-US",
              }),
              " won",
            ],
          }),
        ],
      }),
      (0, t.jsx)(b, {
        label: "Q4 pipeline",
        columns: l,
        cards: n,
        onCardsChange: a,
        cardLabel: (e) => e.company,
        value: (e) => e.amount,
        valueFormat: S,
        locales: "en-US",
        refuse: (e, t) =>
          "won" === t.id && null == e.amount
            ? "Add an amount before it can be won"
            : null,
        onMove: async () => {
          if (
            (await new Promise((e) => setTimeout(e, 600)),
            "Save fails" === e && !o.current)
          )
            throw ((o.current = !0), Error("Offline"));
        },
        addLabel: "deal",
        onAdd: (e, t) => ({
          id: `new-${E++}`,
          column: e.id,
          company: t,
          contact: "No contact yet",
          owner: "MC",
          amount: null,
          closes: "No date",
        }),
        renderCard: (e) =>
          (0, t.jsxs)("div", {
            className: "flex items-start justify-between gap-2",
            children: [
              (0, t.jsxs)("div", {
                className: "min-w-0",
                children: [
                  (0, t.jsx)("p", {
                    className:
                      "truncate text-[13.5px] font-medium leading-tight",
                    children: e.company,
                  }),
                  (0, t.jsxs)("p", {
                    className:
                      "mt-1 truncate text-[12px] leading-tight text-muted-foreground",
                    children: [e.contact, " · closes ", e.closes],
                  }),
                ],
              }),
              (0, t.jsx)(C, { initials: e.owner }),
            ],
          }),
      }),
      (0, t.jsx)("p", {
        className: "mt-1 px-1 text-[11.5px] text-muted-foreground",
        children:
          "Column limit" === e
            ? "Proposal takes three deals at most."
            : "Save fails" === e
              ? "The first move fails to save and flies back."
              : "Drag a deal to another stage. Fjord Analytics has no amount yet, so Won won’t take it.",
      }),
    ],
  });
}
function I() {
  let [e, n] = r.default.useState(N);
  return (0, t.jsxs)("div", {
    style: (0, w.demoAppearance)(),
    className: "w-full max-w-[1140px] text-foreground",
    children: [
      (0, t.jsxs)("div", {
        className: "mb-3 flex items-baseline justify-between gap-3 px-1",
        children: [
          (0, t.jsx)("p", {
            className: "text-[14px] font-medium tracking-[-0.01em]",
            children: "Relay · Cycle 42",
          }),
          (0, t.jsxs)("p", {
            className: "text-[11.5px] tabular-nums text-muted-foreground",
            children: [
              (0, t.jsx)(i.NumberRoll, {
                value: e.filter((e) => "done" === e.column).length,
              }),
              " of ",
              e.length,
              " done",
            ],
          }),
        ],
      }),
      (0, t.jsx)(b, {
        label: "Cycle 42",
        columns: j,
        cards: e,
        onCardsChange: n,
        cardLabel: (e) => `${e.key} ${e.title}`,
        addLabel: "issue",
        onAdd: (e, t) => ({
          id: `new-${E++}`,
          column: e.id,
          key: `REL-${500 + E}`,
          title: t,
          owner: "MC",
        }),
        renderCard: (e) =>
          (0, t.jsxs)("div", {
            className: "flex items-start justify-between gap-2",
            children: [
              (0, t.jsxs)("div", {
                className: "min-w-0",
                children: [
                  (0, t.jsx)("p", {
                    className: "font-mono text-[11px] text-muted-foreground",
                    children: e.key,
                  }),
                  (0, t.jsx)("p", {
                    className: "mt-0.5 text-[13px] leading-snug",
                    children: e.title,
                  }),
                ],
              }),
              (0, t.jsx)(C, { initials: e.owner }),
            ],
          }),
      }),
    ],
  });
}
export default (function ({ tab: e = "Pipeline" }) {
  return "Issues" === e ? (0, t.jsx)(I, {}) : (0, t.jsx)(A, { tab: e }, e);
});
