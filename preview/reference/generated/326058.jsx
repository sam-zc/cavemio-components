"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency3 from "../../../registry/components/number-roll";
import * as dependency4 from "../../../registry/components/scroll-story";
import * as dependency5 from "../../../registry/components/text-morph";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency2;
var s = dependency2;
var a = dependency2;
var i = dependency3;
function u(props) {
  return dependency1.createElement(dependency4.ScrollStory, props);
}
var x = dependency5;
let m = "cubic-bezier(0.16,1,0.3,1)";
function p(e) {
  let [t, n] = (0, r.useState)(!1);
  return (
    (0, r.useEffect)(() => {
      let t = window.setTimeout(() => n(!0), e);
      return () => window.clearTimeout(t);
    }, [e]),
    t
  );
}
let f = [
  {
    title: "Pick a template",
    body: "Start from a page that already moves, not a blank file.",
    visual: (0, t.jsx)(function () {
      let e = p(550);
      return (0, t.jsxs)("div", {
        className: "w-[248px] p-4",
        children: [
          (0, t.jsx)("div", {
            className: "grid grid-cols-3 gap-2",
            children: [0, 1, 2].map((r) =>
              (0, t.jsxs)(
                "div",
                {
                  className:
                    "relative h-[64px] rounded-[10px] border bg-background p-1.5",
                  style: {
                    borderColor:
                      1 === r && e ? "var(--primary)" : "var(--border)",
                    transition: `border-color 300ms ${m}`,
                  },
                  children: [
                    (0, t.jsx)("span", {
                      className:
                        "block h-1.5 w-1/2 rounded-full bg-muted-foreground/30",
                    }),
                    (0, t.jsx)("span", {
                      className: "mt-1.5 block h-5 rounded-[4px] bg-muted",
                    }),
                    (0, t.jsx)("span", {
                      className:
                        "mt-1.5 block h-1.5 w-3/4 rounded-full bg-muted-foreground/20",
                    }),
                    1 === r &&
                      (0, t.jsx)("span", {
                        className:
                          "absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground",
                        style: {
                          transform: e ? "scale(1)" : "scale(0)",
                          transition:
                            "transform 360ms cubic-bezier(0.34,1.36,0.64,1)",
                        },
                        children: (0, t.jsx)(n.Check, {
                          className: "size-2.5",
                          strokeWidth: 3,
                        }),
                      }),
                  ],
                },
                r,
              ),
            ),
          }),
          (0, t.jsx)("p", {
            className: "mt-3 text-[12px] text-muted-foreground",
            children: (0, t.jsx)(x.TextMorph, {
              children: e ? "Picked: Index" : "Three to start from",
            }),
          }),
        ],
      });
    }, {}),
  },
  {
    title: "Make it yours",
    body: "Your name, your colour. The motion comes with it.",
    visual: (0, t.jsx)(function () {
      let e = "Kept Coffee",
        [n, s] = (0, r.useState)(0);
      (0, r.useEffect)(() => {
        let t = window.setInterval(
          () => s((t) => (t < e.length ? t + 1 : t)),
          70,
        );
        return () => window.clearInterval(t);
      }, []);
      let a = n === e.length;
      return (0, t.jsxs)("div", {
        className: "w-[248px] p-4",
        children: [
          (0, t.jsx)("p", {
            className: "text-[11px] text-muted-foreground",
            children: "Name",
          }),
          (0, t.jsxs)("div", {
            className:
              "mt-1 flex h-9 items-center rounded-[10px] border border-border bg-background px-3 text-[13.5px] text-foreground",
            children: [
              e.slice(0, n),
              (0, t.jsx)("span", {
                className:
                  "ml-px h-4 w-px bg-foreground motion-safe:animate-[ui-blink_1s_steps(1)_infinite]",
              }),
            ],
          }),
          (0, t.jsx)("p", {
            className: "mt-3 text-[11px] text-muted-foreground",
            children: "Colour",
          }),
          (0, t.jsx)("div", {
            className: "mt-1.5 flex gap-2",
            children: [
              "var(--chart-1)",
              "var(--chart-2)",
              "var(--chart-3)",
              "var(--foreground)",
            ].map((e, r) =>
              (0, t.jsx)(
                "span",
                {
                  className: "size-6 rounded-full border-2",
                  style: {
                    backgroundColor: e,
                    borderColor:
                      a && 2 === r ? "var(--background)" : "transparent",
                    outline:
                      a && 2 === r
                        ? "1px solid var(--foreground)"
                        : "1px solid transparent",
                    transition: `outline-color 300ms ${m}, border-color 300ms ${m}`,
                  },
                },
                r,
              ),
            ),
          }),
        ],
      });
    }, {}),
  },
  {
    title: "Connect payments",
    body: "One switch, and the pricing section takes real money.",
    visual: (0, t.jsx)(function () {
      let e = p(500),
        r = p(1400);
      return (0, t.jsxs)("div", {
        className: "w-[248px] p-4",
        children: [
          (0, t.jsxs)("div", {
            className: "flex items-center gap-3",
            children: [
              (0, t.jsx)("span", {
                className:
                  "flex size-9 items-center justify-center rounded-[10px] border border-border bg-background",
                children: (0, t.jsx)(s.CreditCard, {
                  className: "size-4 text-foreground",
                }),
              }),
              (0, t.jsxs)("div", {
                className: "min-w-0 flex-1",
                children: [
                  (0, t.jsx)("p", {
                    className: "text-[13px] font-medium text-foreground",
                    children: "Payments",
                  }),
                  (0, t.jsxs)("p", {
                    className:
                      "flex items-center gap-1.5 text-[11.5px] text-muted-foreground",
                    children: [
                      (0, t.jsx)("span", {
                        className: `size-1.5 rounded-full transition-colors duration-300 ${r ? "bg-emerald-500" : "bg-muted-foreground/50"}`,
                      }),
                      (0, t.jsx)(x.TextMorph, {
                        children: r
                          ? "Connected"
                          : e
                            ? "Connecting"
                            : "Not connected",
                      }),
                    ],
                  }),
                ],
              }),
              (0, t.jsx)("span", {
                className: "relative h-5 w-9 shrink-0 rounded-full",
                style: {
                  backgroundColor: e ? "var(--primary)" : "var(--muted)",
                  transition: `background-color 300ms ${m}`,
                },
                children: (0, t.jsx)("span", {
                  className:
                    "absolute top-0.5 size-4 rounded-full bg-background",
                  style: {
                    left: e ? 18 : 2,
                    transition: "left 320ms cubic-bezier(0.34,1.36,0.64,1)",
                  },
                }),
              }),
            ],
          }),
          (0, t.jsxs)("div", {
            className:
              "mt-3 flex justify-between border-t border-border pt-3 text-[12px] text-muted-foreground",
            children: [
              (0, t.jsx)("span", { children: "Fees" }),
              (0, t.jsx)("span", {
                className: "tabular-nums text-foreground",
                children: "2.9% + 30¢",
              }),
            ],
          }),
        ],
      });
    }, {}),
  },
  {
    title: "Go live",
    body: "Push it and watch the first visitors arrive.",
    visual: (0, t.jsx)(function () {
      let e = p(350);
      return (0, t.jsxs)("div", {
        className: "w-[248px] p-4",
        children: [
          (0, t.jsxs)("div", {
            className:
              "flex h-8 items-center gap-2 rounded-full border border-border bg-background px-3 text-[12.5px] text-foreground",
            children: [
              (0, t.jsx)(a.Lock, { className: "size-3 text-muted-foreground" }),
              "kept.coffee",
              (0, t.jsxs)("span", {
                className:
                  "ml-auto flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400",
                style: { opacity: +!!e, transition: "opacity 300ms" },
                children: [
                  (0, t.jsx)("span", {
                    className: "size-1.5 rounded-full bg-emerald-500",
                  }),
                  "Live",
                ],
              }),
            ],
          }),
          (0, t.jsx)("p", {
            className:
              "mt-4 text-[28px] font-semibold leading-none tracking-tight text-foreground tabular-nums",
            children: (0, t.jsx)(i.NumberRoll, { value: 128 * !!e }),
          }),
          (0, t.jsx)("p", {
            className: "mt-1.5 text-[12px] text-muted-foreground",
            children: "visitors in the first hour",
          }),
        ],
      });
    }, {}),
  },
];
export default (function () {
  return (0, t.jsxs)("div", {
    className: "w-full max-w-[640px]",
    children: [
      (0, t.jsx)("p", {
        className: "mb-2 text-center text-[12px] text-muted-foreground",
        children: "Scroll inside the box.",
      }),
      (0, t.jsx)("div", {
        className:
          "h-[440px] overflow-y-auto overscroll-y-contain rounded-[20px] border border-border bg-background px-4 [scrollbar-width:thin] sm:px-6",
        children: (0, t.jsx)(u, { steps: f }),
      }),
    ],
  });
});
