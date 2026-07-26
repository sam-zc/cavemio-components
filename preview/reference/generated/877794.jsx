"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency3 from "../icon-factory";
import * as dependency5 from "../../../registry/components/text-morph";
import * as dependency6 from "../../../registry/components/imported-ui-interaction-motion";
import * as dependency7 from "../../../registry/components/magnifying-dock";
import * as dependency8 from "./25369.jsx";
("use strict");
var t = dependency0;
var a = dependency1;
var n = dependency2;
var r = dependency2;
let l = (0, dependency3.default)("Music2", [
  ["circle", { cx: "8", cy: "18", r: "4", key: "1fc0mg" }],
  ["path", { d: "M12 18V2l7 4", key: "g04rme" }],
]);
var s = dependency2;
var i = dependency2;
var o = dependency2;
var d = dependency2;
var c = dependency5;
var h = dependency6;
function x(props) {
  return dependency1.createElement(dependency7.MagnifyingDock, props);
}
var f = dependency8;
let b = [
  { from: "Ana Ruiz", subject: "Pistachio paste is on its way", time: "9:12" },
  { from: "Tom Okafor", subject: "Saturday rota, final version", time: "8:40" },
  { from: "Kept Weekly", subject: "Your best week since June", time: "Mon" },
];
let y = [
  { time: "8:00", title: "Weekend batch", note: "Back kitchen" },
  { time: "11:30", title: "Tasting with Mei", note: "Three new flavours" },
  { time: "15:00", title: "Queue cover", note: "Ana and Tom" },
];
function g({ on: e, onToggle: a, label: n }) {
  return (0, t.jsxs)("button", {
    type: "button",
    role: "switch",
    "aria-checked": e,
    onClick: a,
    className:
      "cursor-pointer flex w-full items-center justify-between py-2.5 text-left text-[12.5px]",
    children: [
      (0, t.jsx)("span", { children: n }),
      (0, t.jsx)("span", {
        className: `relative h-5 w-8 rounded-full transition-colors duration-300 ${e ? "bg-primary" : "bg-muted shadow-[inset_0_0_0_1px_var(--border)]"}`,
        children: (0, t.jsx)("span", {
          className:
            "absolute left-0.5 top-0.5 size-4 rounded-full bg-background shadow-[0_0_0_1px_var(--border)]",
          style: {
            transform: e ? "translateX(12px)" : "none",
            transition: "transform 360ms cubic-bezier(0.34,1.36,0.64,1)",
          },
        }),
      }),
    ],
  });
}
export default (function () {
  let e = (0, h.useInteractionReducedMotion)(),
    [u, p] = a.default.useState("inbox"),
    [m, v] = a.default.useState(!1),
    [k, j] = a.default.useState(3),
    [w, N] = a.default.useState(!0),
    [M, V] = a.default.useState(!0),
    [S, E] = a.default.useState(!1);
  a.default.useEffect(() => {
    if (!m || "inbox" !== u || !k) return;
    let e = window.setTimeout(() => j(0), 700);
    return () => window.clearTimeout(e);
  }, [m, u, k]);
  let T = [
    {
      id: "inbox",
      label: "Inbox",
      icon: (0, t.jsx)(r.Inbox, {}),
      badge: k,
      content: (0, t.jsx)("ul", {
        className: "-mx-1",
        children: b.map((e, a) =>
          (0, t.jsxs)(
            "li",
            {
              className: "flex items-center gap-3 rounded-lg px-1 py-2",
              children: [
                (0, t.jsx)("span", {
                  className:
                    "flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10.5px] font-medium",
                  children: e.from[0],
                }),
                (0, t.jsxs)("span", {
                  className: "min-w-0 flex-1",
                  children: [
                    (0, t.jsx)("span", {
                      className: "block truncate text-[12.5px] font-medium",
                      children: e.from,
                    }),
                    (0, t.jsx)("span", {
                      className:
                        "block truncate text-[12px] text-muted-foreground",
                      children: e.subject,
                    }),
                  ],
                }),
                (0, t.jsxs)("span", {
                  className: "flex shrink-0 flex-col items-end gap-1",
                  children: [
                    (0, t.jsx)("span", {
                      className:
                        "text-[10.5px] tabular-nums text-muted-foreground",
                      children: e.time,
                    }),
                    (0, t.jsx)("span", {
                      className: "size-1.5 rounded-full bg-primary",
                      style: {
                        opacity: +(a < k),
                        transform: a < k ? "none" : "scale(0.4)",
                        transition: `opacity 260ms ${h.EASE_OUT} ${60 * a}ms, transform 360ms ${h.EASE_OUT} ${60 * a}ms`,
                      },
                    }),
                  ],
                }),
              ],
            },
            e.from,
          ),
        ),
      }),
    },
    {
      id: "calendar",
      label: "Calendar",
      title: "Today",
      icon: (0, t.jsx)(n.CalendarDays, {}),
      content: (0, t.jsx)("ol", {
        className: "relative",
        children: y.map((e, a) =>
          (0, t.jsxs)(
            "li",
            {
              className: "relative flex gap-3 py-2",
              children: [
                (0, t.jsx)("span", {
                  className:
                    "w-10 shrink-0 pt-px text-[11px] tabular-nums text-muted-foreground",
                  children: e.time,
                }),
                (0, t.jsxs)("span", {
                  className: `min-w-0 flex-1 border-l pl-3 ${1 === a ? "border-primary" : "border-border"}`,
                  children: [
                    (0, t.jsx)("span", {
                      className: "block text-[12.5px] font-medium",
                      children: e.title,
                    }),
                    (0, t.jsx)("span", {
                      className: "block text-[12px] text-muted-foreground",
                      children: e.note,
                    }),
                  ],
                }),
              ],
            },
            e.title,
          ),
        ),
      }),
    },
    {
      id: "notes",
      label: "Notes",
      title: "Saturday flavours",
      icon: (0, t.jsx)(s.NotebookPen, {}),
      content: (0, t.jsxs)("div", {
        className:
          "space-y-2 text-[12.5px] leading-relaxed text-muted-foreground",
        children: [
          (0, t.jsx)("p", {
            children:
              "Pistachio leads again. Churn it first so it sets before the rush.",
          }),
          (0, t.jsx)("p", {
            children:
              "Try the fig and honey on the regulars before it goes on the board.",
          }),
        ],
      }),
    },
    {
      id: "music",
      label: "Music",
      title: "Now playing",
      icon: (0, t.jsx)(l, {}),
      content: (0, t.jsxs)("div", {
        children: [
          (0, t.jsxs)("div", {
            className: "flex items-center gap-3",
            children: [
              (0, t.jsx)("span", {
                className:
                  "size-11 shrink-0 rounded-lg bg-[linear-gradient(135deg,color-mix(in_oklab,var(--primary)_70%,white),var(--primary))]",
              }),
              (0, t.jsxs)("span", {
                className: "min-w-0 flex-1",
                children: [
                  (0, t.jsx)("span", {
                    className: "block truncate text-[12.5px] font-medium",
                    children: "Slow Churn",
                  }),
                  (0, t.jsx)("span", {
                    className:
                      "block truncate text-[12px] text-muted-foreground",
                    children: "The Back Kitchen",
                  }),
                ],
              }),
              (0, t.jsxs)("button", {
                type: "button",
                "aria-label": w ? "Pause" : "Play",
                onClick: () => N((e) => !e),
                className:
                  "cursor-pointer relative flex size-8 items-center justify-center rounded-full bg-foreground text-background",
                children: [
                  (0, t.jsx)(i.Pause, {
                    className: "absolute size-3.5 fill-current",
                    style: (0, h.interactionIcon)(w, e),
                  }),
                  (0, t.jsx)(o.Play, {
                    className: "absolute size-3.5 translate-x-px fill-current",
                    style: (0, h.interactionIcon)(!w, e),
                  }),
                ],
              }),
            ],
          }),
          (0, t.jsx)("div", {
            className: "mt-3.5 h-1 overflow-hidden rounded-full bg-muted",
            children: (0, t.jsx)("div", {
              className:
                "h-full origin-left rounded-full bg-foreground motion-safe:animate-[ui-progress_24s_linear_infinite]",
              style: {
                animationPlayState:
                  w && m && "music" === u ? "running" : "paused",
              },
            }),
          }),
          (0, t.jsx)("p", {
            className: "mt-2 text-[11px] text-muted-foreground",
            children: (0, t.jsx)(c.TextMorph, {
              children: w ? "Playing in the shop" : "Paused",
            }),
          }),
        ],
      }),
    },
    {
      id: "settings",
      label: "Settings",
      icon: (0, t.jsx)(d.SlidersHorizontal, {}),
      content: (0, t.jsxs)("div", {
        className: "-my-1 divide-y divide-border",
        children: [
          (0, t.jsx)(g, {
            on: M,
            onToggle: () => V((e) => !e),
            label: "Focus mode",
          }),
          (0, t.jsx)(g, {
            on: S,
            onToggle: () => E((e) => !e),
            label: "Order sounds",
          }),
        ],
      }),
    },
  ];
  return (0, t.jsxs)("div", {
    style: (0, f.demoAppearance)(),
    className: "w-full max-w-[560px] text-foreground",
    children: [
      (0, t.jsxs)("div", {
        className:
          "relative flex h-[440px] flex-col justify-end overflow-hidden rounded-[22px] border border-border bg-muted/40 px-4 pb-5",
        children: [
          (0, t.jsxs)("div", {
            className:
              "pointer-events-none absolute inset-x-0 top-12 text-center",
            style: {
              opacity: m ? 0.35 : 1,
              transform: m ? "translateY(-10px) scale(0.97)" : "none",
              transition: e
                ? "none"
                : `opacity 420ms ${h.EASE_OUT}, transform 520ms ${h.EASE_OUT}`,
            },
            children: [
              (0, t.jsx)("p", {
                className:
                  "text-[64px] font-medium leading-none tracking-[-0.05em] tabular-nums text-foreground",
                children: "9:41",
              }),
              (0, t.jsx)("p", {
                className: "mt-2 text-[12px] text-muted-foreground",
                children: "Saturday 12 October · Kept, back kitchen",
              }),
            ],
          }),
          (0, t.jsx)(x, {
            items: T,
            value: u,
            onValueChange: p,
            open: m,
            onOpenChange: v,
            label: "Kept tools",
            size: 44,
          }),
        ],
      }),
      (0, t.jsx)("p", {
        className: "mt-4 text-center text-[11px] text-muted-foreground",
        children: "Sweep across the dock. Choose a tool to open it in place.",
      }),
    ],
  });
});
