"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency5 from "../../../registry/components/card-deck";
import * as dependency6 from "./25369.jsx";
("use strict");
var t = dependency0;
function d(props) {
  return dependency1.createElement(dependency5.CardDeck, props);
}
function c({ kind: e, color: r }) {
  return (0, t.jsxs)("div", {
    "aria-hidden": "true",
    className:
      "relative mx-auto flex h-[152px] w-full max-w-[230px] items-center justify-center",
    style: { color: r },
    children: [
      0 === e &&
        (0, t.jsx)("div", {
          className: "relative h-28 w-36",
          children: [-12, 7, 0].map((e, r) =>
            (0, t.jsxs)(
              "div",
              {
                className:
                  "absolute inset-0 flex flex-col gap-2 rounded-xl border border-current/15 bg-card p-4",
                style: {
                  transform: `translate(${(r - 1) * 13}px, ${(r - 1) * 6}px) rotate(${e}deg)`,
                },
                children: [
                  (0, t.jsx)("span", {
                    className: "h-1.5 w-7 rounded-full bg-current/40",
                  }),
                  (0, t.jsx)("span", {
                    className: "mt-2 h-1 w-full rounded-full bg-current/10",
                  }),
                  (0, t.jsx)("span", {
                    className: "h-1 w-4/5 rounded-full bg-current/10",
                  }),
                  (0, t.jsx)("span", {
                    className: "h-1 w-3/5 rounded-full bg-current/10",
                  }),
                ],
              },
              r,
            ),
          ),
        }),
      1 === e &&
        (0, t.jsxs)("svg", {
          viewBox: "0 0 230 152",
          className: "size-full",
          fill: "none",
          children: [
            (0, t.jsx)("path", {
              d: "M50 42 C115 42 115 110 180 110 M50 110 C115 110 115 42 180 42",
              stroke: "currentColor",
              strokeOpacity: ".25",
            }),
            [
              [50, 42],
              [50, 110],
              [180, 42],
              [180, 110],
            ].map(([e, r], a) =>
              (0, t.jsxs)(
                "g",
                {
                  children: [
                    (0, t.jsx)("rect", {
                      x: e - 19,
                      y: r - 19,
                      width: "38",
                      height: "38",
                      rx: "11",
                      fill: "var(--card)",
                      stroke: "currentColor",
                      strokeOpacity: ".25",
                    }),
                    (0, t.jsx)("circle", {
                      cx: e,
                      cy: r,
                      r: "5",
                      fill: "currentColor",
                      opacity: ".55",
                    }),
                  ],
                },
                a,
              ),
            ),
            (0, t.jsx)("circle", {
              cx: "115",
              cy: "76",
              r: "19",
              fill: "var(--card)",
              stroke: "currentColor",
              strokeOpacity: ".4",
            }),
            (0, t.jsx)("path", {
              d: "M108 76h14m-7-7v14",
              stroke: "currentColor",
              strokeWidth: "1.5",
              strokeLinecap: "round",
            }),
          ],
        }),
      2 === e &&
        (0, t.jsxs)("div", {
          className: "relative size-28",
          children: [
            [0, 60, 120].map((e) =>
              (0, t.jsx)(
                "div",
                {
                  className:
                    "absolute inset-x-6 inset-y-0 rounded-full border border-current/25 bg-current/5",
                  style: { transform: `rotate(${e}deg)` },
                },
                e,
              ),
            ),
            (0, t.jsx)("div", {
              className: "absolute inset-10 rounded-full bg-current/70",
            }),
          ],
        }),
      3 === e &&
        (0, t.jsx)("div", {
          className: "flex items-center -space-x-4",
          children: ["M", "A", "J"].map((e, a) =>
            (0, t.jsx)(
              "span",
              {
                className:
                  "flex size-16 items-center justify-center rounded-full border border-border text-xl font-medium",
                style: {
                  background: `color-mix(in srgb, ${r} ${8 + 5 * a}%, var(--card))`,
                  transform: `translateY(${1 === a ? -12 : 8}px)`,
                },
                children: e,
              },
              e,
            ),
          ),
        }),
    ],
  });
}
var u = dependency6;
let m = [
  {
    id: "capture",
    title: "Catch the little things.",
    body: "The passing thought. The good sentence. An idea before it disappears.",
    label: "Capture",
    color: "var(--primary)",
  },
  {
    id: "connect",
    title: "Follow the thread.",
    body: "Bring related thoughts together. See the connections you almost missed.",
    label: "Connect",
    color: "var(--primary)",
  },
  {
    id: "create",
    title: "Make something of it.",
    body: "Give your ideas a shape, from a first sketch to something worth sharing.",
    label: "Create",
    color: "var(--primary)",
  },
  {
    id: "share",
    title: "Better in good company.",
    body: "Invite a fresh pair of eyes. Leave room for a different point of view.",
    label: "Share",
    color: "var(--primary)",
  },
];
export default (function () {
  return (0, t.jsxs)("div", {
    style: (0, u.demoAppearance)(),
    className: "w-full max-w-[460px] rounded-2xl bg-background py-3",
    children: [
      (0, t.jsxs)("div", {
        className: "mb-7 text-center",
        children: [
          (0, t.jsx)("p", {
            className:
              "text-[22px] font-medium tracking-[-0.04em] text-foreground",
            children: "Fieldnotes.",
          }),
          (0, t.jsx)("p", {
            className: "mt-1 text-[12px] text-muted-foreground",
            children: "A home for your next good idea.",
          }),
        ],
      }),
      (0, t.jsx)(d, {
        items: m,
        getLabel: (e) => e.label,
        label: "The Fieldnotes collection",
        height: 330,
        renderCard: (e, { index: r }) =>
          (0, t.jsxs)("div", {
            className: "flex h-full flex-col p-6",
            style: {
              background: `linear-gradient(155deg, color-mix(in srgb, ${e.color} 8%, var(--card)), var(--card) 75%)`,
            },
            children: [
              (0, t.jsxs)("div", {
                className: "flex items-center justify-between",
                children: [
                  (0, t.jsx)("span", {
                    className:
                      "text-[10px] font-medium uppercase tracking-[0.15em]",
                    style: { color: e.color },
                    children: e.label,
                  }),
                  (0, t.jsxs)("span", {
                    className: "font-mono text-[10px] text-muted-foreground",
                    children: ["0", r + 1],
                  }),
                ],
              }),
              (0, t.jsx)(c, { kind: r, color: e.color }),
              (0, t.jsx)("h3", {
                className:
                  "max-w-52 text-[24px] font-medium leading-[1.1] tracking-[-0.04em]",
                children: e.title,
              }),
              (0, t.jsx)("p", {
                className:
                  "mt-3 text-[12px] leading-relaxed text-muted-foreground",
                children: e.body,
              }),
            ],
          }),
      }),
      (0, t.jsx)("p", {
        className: "mt-4 text-center text-[10px] text-muted-foreground",
        children: "Drag a card aside · Arrow keys work too",
      }),
    ],
  });
});
