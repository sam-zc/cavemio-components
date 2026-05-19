"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency3 from "../icon-factory";
import * as dependency4 from "../../../registry/components/icon-morph";
import * as dependency5 from "../../../registry/components/text-morph";
import * as dependency6 from "../../../registry/components/imported-ui-interaction-motion";
("use strict");
var t = dependency0;
var a = dependency1;
var r = dependency2;
var s = dependency3;
let i = (0, s.default)("BellOff", [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0", key: "vwvbt9" }],
  [
    "path",
    {
      d: "M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742",
      key: "178tsu",
    },
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  [
    "path",
    {
      d: "M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05",
      key: "1hqiys",
    },
  ],
]);
var o = dependency2;
var n = dependency2;
var l = dependency2;
var c = dependency2;
var d = dependency2;
var u = dependency2;
var f = dependency2;
var p = dependency2;
var x = dependency2;
var h = dependency2;
let m = (0, s.default)("Volume2", [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw",
    },
  ],
  ["path", { d: "M16 9a5 5 0 0 1 0 6", key: "1q6k2b" }],
  ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728", key: "ijwkga" }],
]);
let y = (0, s.default)("VolumeX", [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw",
    },
  ],
  ["line", { x1: "22", x2: "16", y1: "9", y2: "15", key: "1ewh16" }],
  ["line", { x1: "16", x2: "22", y1: "9", y2: "15", key: "5ykzw1" }],
]);
var g = dependency2;
var b = dependency4;
var j = dependency5;
var k = dependency6;
let v = [
  {
    mode: "blur",
    label: "Play",
    from: (0, t.jsx)(p.Play, {}),
    to: (0, t.jsx)(f.Pause, {}),
  },
  {
    mode: "rotate",
    label: "Add",
    from: (0, t.jsx)(x.Plus, {}),
    to: (0, t.jsx)(g.X, {}),
  },
  {
    mode: "flip",
    label: "Dark mode",
    from: (0, t.jsx)(h.Sun, {}),
    to: (0, t.jsx)(u.Moon, {}),
  },
  {
    mode: "draw",
    label: "Copy",
    from: (0, t.jsx)(n.Copy, {}),
    to: (0, t.jsx)(o.Check, {
      className: "text-emerald-600 dark:text-emerald-400",
    }),
  },
];
let M = `inline-flex h-8 items-center gap-2 rounded-full bg-card px-3 text-[12.5px] font-medium text-foreground shadow-[inset_0_0_0_1px_var(--border)] hover:bg-accent cursor-pointer ${k.INTERACTION_PRESS} ${k.INTERACTION_FOCUS}`;
export default (function ({ tab: e = "Modes" }) {
  let [s, o] = a.useState(!1),
    [n, u] = a.useState(!1),
    [f, p] = a.useState(!0),
    [x, h] = a.useState(!0);
  return "Buttons" === e
    ? (0, t.jsxs)("div", {
        className:
          "flex w-full max-w-[340px] flex-col items-center justify-center gap-6 px-2 py-4",
        children: [
          (0, t.jsxs)("div", {
            className: "flex items-center gap-3",
            children: [
              (0, t.jsx)(b.IconMorphButton, {
                variant: "ghost",
                size: "sm",
                label: "Menu",
                mode: "rotate",
                active: s,
                onActiveChange: o,
                from: (0, t.jsx)(d.Menu, {}),
                to: (0, t.jsx)(g.X, {}),
              }),
              (0, t.jsx)(b.IconMorphButton, {
                variant: "outline",
                size: "md",
                label: "Menu",
                mode: "rotate",
                active: s,
                onActiveChange: o,
                from: (0, t.jsx)(d.Menu, {}),
                to: (0, t.jsx)(g.X, {}),
              }),
              (0, t.jsx)(b.IconMorphButton, {
                variant: "solid",
                size: "lg",
                label: "Menu",
                mode: "rotate",
                active: s,
                onActiveChange: o,
                from: (0, t.jsx)(d.Menu, {}),
                to: (0, t.jsx)(g.X, {}),
              }),
            ],
          }),
          (0, t.jsx)("span", {
            className: "text-center text-[12px] text-muted-foreground",
            children: "28, 36 and 40px; ghost, outline and solid",
          }),
        ],
      })
    : "Controls" === e
      ? (0, t.jsxs)("div", {
          className:
            "flex w-full max-w-[320px] flex-col items-center justify-center gap-5 px-2 py-4",
          children: [
            (0, t.jsxs)("div", {
              className:
                "flex w-full items-center justify-between rounded-full bg-card py-1 pl-4 pr-1 shadow-[inset_0_0_0_1px_var(--border)]",
              children: [
                (0, t.jsx)("span", {
                  className: "font-mono text-[12.5px] text-muted-foreground",
                  children: (0, t.jsx)(j.TextMorph, {
                    children: n ? "fernhill-2041" : "•••••••••••••",
                  }),
                }),
                (0, t.jsx)(b.IconMorphButton, {
                  variant: "ghost",
                  size: "sm",
                  label: "Show password",
                  active: n,
                  onActiveChange: u,
                  from: (0, t.jsx)(l.Eye, {}),
                  to: (0, t.jsx)(c.EyeOff, {}),
                }),
              ],
            }),
            (0, t.jsxs)("div", {
              className: "flex items-center gap-2",
              children: [
                (0, t.jsxs)("button", {
                  type: "button",
                  "aria-pressed": !f,
                  onClick: () => p(!f),
                  className: M,
                  children: [
                    (0, t.jsx)(b.IconMorph, {
                      size: 14,
                      active: !f,
                      from: (0, t.jsx)(m, {}),
                      to: (0, t.jsx)(y, {}),
                    }),
                    (0, t.jsx)(j.TextMorph, {
                      children: f ? "Sound on" : "Muted",
                    }),
                  ],
                }),
                (0, t.jsxs)("button", {
                  type: "button",
                  "aria-pressed": !x,
                  onClick: () => h(!x),
                  className: M,
                  children: [
                    (0, t.jsx)(b.IconMorph, {
                      size: 14,
                      mode: "draw",
                      active: !x,
                      from: (0, t.jsx)(r.Bell, {}),
                      to: (0, t.jsx)(i, {}),
                    }),
                    (0, t.jsx)(j.TextMorph, {
                      children: x ? "Alerts" : "Silent",
                    }),
                  ],
                }),
              ],
            }),
            (0, t.jsx)("span", {
              className: "text-center text-[12px] text-muted-foreground",
              children: "Icon and label change in the same motion",
            }),
          ],
        })
      : (0, t.jsxs)("div", {
          className:
            "flex w-full max-w-[340px] flex-col items-center justify-center gap-6 px-2 py-4",
          children: [
            (0, t.jsx)("div", {
              className: "flex items-start gap-5",
              children: v.map((e) =>
                (0, t.jsxs)(
                  "div",
                  {
                    className: "flex flex-col items-center gap-2",
                    children: [
                      (0, t.jsx)(b.IconMorphButton, {
                        label: e.label,
                        mode: e.mode,
                        from: e.from,
                        to: e.to,
                      }),
                      (0, t.jsx)("span", {
                        className:
                          "font-mono text-[11px] text-muted-foreground",
                        children: e.mode,
                      }),
                    ],
                  },
                  e.mode,
                ),
              ),
            }),
            (0, t.jsx)("span", {
              className: "text-center text-[12px] text-muted-foreground",
              children: "Press one, then press it again quickly",
            }),
          ],
        });
});
