"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "../icon-factory";
import * as dependency2 from "react";
import * as dependency9 from "../../../registry/components/agent-playback";
("use strict");
var t = dependency0;
var r = dependency1;
let s = (0, r.default)("Calculator", [
  [
    "rect",
    { width: "16", height: "20", x: "4", y: "2", rx: "2", key: "1nb95v" },
  ],
  ["line", { x1: "8", x2: "16", y1: "6", y2: "6", key: "x4nwl0" }],
  ["line", { x1: "16", x2: "16", y1: "14", y2: "18", key: "wjye3r" }],
  ["path", { d: "M16 10h.01", key: "1m94wz" }],
  ["path", { d: "M12 10h.01", key: "1nrarc" }],
  ["path", { d: "M8 10h.01", key: "19clt8" }],
  ["path", { d: "M12 14h.01", key: "1etili" }],
  ["path", { d: "M8 14h.01", key: "6423bh" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }],
  ["path", { d: "M8 18h.01", key: "lrp35t" }],
]);
let n = (0, r.default)("Truck", [
  [
    "path",
    {
      d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",
      key: "wrbu53",
    },
  ],
  ["path", { d: "M15 18H9", key: "1lyqi6" }],
  [
    "path",
    {
      d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",
      key: "lysw3i",
    },
  ],
  ["circle", { cx: "17", cy: "18", r: "2", key: "332jqn" }],
  ["circle", { cx: "7", cy: "18", r: "2", key: "19iecd" }],
]);
function v(props) {
  return dependency2.createElement(dependency9.AgentPlayback, props);
}
let w = [
  {
    prompt: "Which supplier should we use for pistachio paste this season?",
    steps: [
      {
        type: "thinking",
        steps: [
          "Reading last season’s orders",
          "Checking what changed in Bronte prices",
          "Listing suppliers that ship to us",
        ],
      },
      {
        type: "search",
        queries: [
          {
            query: "Bronte pistachio paste wholesale price 2026",
            sources: [
              {
                url: "https://nutmarket.report/bronte",
                title: "Bronte DOP prices, week 40",
              },
              {
                url: "https://bronte-growers.coop/paste",
                title: "Bronte pistachio paste: wholesale grades",
              },
              {
                url: "https://gelateria-notes.com/suppliers",
                title: "Where Italian gelaterias buy their nuts",
              },
            ],
          },
          {
            query: "pistachio paste suppliers shipping to the UK",
            sources: [
              {
                url: "https://sicilyfoods.it/export",
                title: "Export terms and delivery times",
              },
              {
                url: "https://scoopindustry.news/costs",
                title: "What a scoop of pistachio really costs",
              },
            ],
          },
        ],
      },
      {
        type: "tool",
        name: "compare_prices",
        title: "Compare prices",
        icon: (0, t.jsx)(s, { className: "size-3.5" }),
        input: {
          product: "pistachio paste",
          origin: "Bronte",
          quantity_kg: 12,
          max_per_kg: 50,
        },
        output: {
          best: "Bronte Growers Co-op",
          per_kg: "€46.80",
          delivery: "4 days",
        },
        duration: 1400,
        open: !1,
      },
      {
        type: "answer",
        content: [
          "Go with the Bronte Growers Co-op: €46.80 a kilo for DOP paste, about 6% under last season ",
          { type: "citation", label: "nutmarket.report" },
          ", and they deliver in four days. Order 12 kg by Wednesday to have it for the weekend batch.",
        ],
        sources: [
          { name: "nutmarket.report" },
          { name: "bronte-growers.coop" },
          { name: "sicilyfoods.it" },
        ],
      },
    ],
  },
  {
    prompt: "Great, order 12 kg and add it to Friday’s deliveries",
    steps: [
      {
        type: "thinking",
        steps: ["Drafting the order", "Finding Friday’s delivery slot"],
      },
      {
        type: "tool",
        name: "create_order",
        title: "Place order",
        icon: (0, t.jsx)(n, { className: "size-3.5" }),
        input: {
          supplier: "Bronte Growers Co-op",
          item: "Pistachio paste, DOP",
          quantity_kg: 12,
          deliver: "Friday, 8–10 am",
        },
        output: { order: "PO-2041", total: "€561.60", status: "confirmed" },
        duration: 1200,
      },
      {
        type: "answer",
        content:
          "Done. Order PO-2041 is confirmed for €561.60 and it’s on Friday’s delivery list for 8–10 am. I’ll remind Ana on Thursday evening.",
      },
    ],
  },
];
export default (function () {
  return (0, t.jsx)("div", {
    className: "w-full max-w-[560px]",
    children: (0, t.jsx)(v, { turns: w, header: "Relay", height: 560 }),
  });
});
