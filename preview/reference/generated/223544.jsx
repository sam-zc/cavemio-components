"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/live-cursors";
import * as dependency3 from "../../../registry/components/number-roll";
("use strict");
var t = dependency0;
var r = dependency1;
function f(props) {
  return dependency1.createElement(dependency2.LiveCursors, props);
}
var m = dependency3;
let x = { x: 0.05, y: 0.06, width: 0.9, height: 0.09 };
let h = { x: 0.12, y: 0.21, width: 0.76, height: 0.15 };
let p = { x: 0.31, y: 0.55, width: 0.18, height: 0.09 };
let g = { x: 0.51, y: 0.55, width: 0.18, height: 0.09 };
let y = { x: 0.05, y: 0.72, width: 0.28, height: 0.21 };
let b = { x: 0.36, y: 0.72, width: 0.28, height: 0.21 };
let w = { x: 0.67, y: 0.72, width: 0.28, height: 0.21 };
let v = [
  {
    id: "ana",
    name: "Ana",
    path: [
      [0, 0.3, 0.3],
      [1.2, 0.46, 0.27],
      [6.5, 0.48, 0.29],
      [7.6, 0.41, 0.6],
      [12.5, 0.43, 0.61],
      [13.6, 0.2, 0.84],
      [16, 0.3, 0.3],
    ],
    say: [
      [2.2, 6.2, "Love this headline"],
      [8.8, 12.4, "Make this one darker?"],
    ],
    clicks: [1.2, 7.7],
    select: [
      [1.3, h],
      [7.8, p],
      [13.8, null],
    ],
  },
  {
    id: "kofi",
    name: "Kofi",
    path: [
      [0, 0.82, 0.86],
      [2.6, 0.84, 0.84],
      [3.6, 0.52, 0.8],
      [5.4, 0.55, 0.82],
      [14.8, 0.55, 0.82],
      [16, 0.82, 0.86],
    ],
    clicks: [3.7],
    select: [
      [3.8, b],
      [15, null],
    ],
  },
  {
    id: "mei",
    name: "Mei",
    path: [
      [2, 0.62, 0.48],
      [3.4, 0.86, 0.12],
      [8.6, 0.85, 0.13],
      [10, 0.7, 0.5],
      [12, 0.72, 0.52],
    ],
    say: [[4.4, 8.4, "Pricing link goes here"]],
    clicks: [3.5],
    select: [
      [3.6, x],
      [9.6, null],
    ],
    here: [2, 12],
  },
];
function j({ box: e, className: r, children: n }) {
  return (0, t.jsx)("div", {
    className: `absolute ${r}`,
    style: {
      left: `${100 * e.x}%`,
      top: `${100 * e.y}%`,
      width: `${100 * e.width}%`,
      height: `${100 * e.height}%`,
    },
    children: n,
  });
}
export default (function () {
  let [e, n] = (0, r.useState)([]),
    [s, a] = (0, r.useState)(null),
    l = (0, r.useRef)(0);
  ((0, r.useEffect)(() => {
    l.current = performance.now();
    let e = window.setInterval(() => {
      let e = (performance.now() - l.current) / 1e3,
        t = Math.floor(e / 16),
        r = e % 16;
      n(
        v
          .map((e) =>
            (function (e, t, r) {
              let n;
              if (e.here && (t < e.here[0] || t > e.here[1])) return null;
              let s = e.path,
                a = s.findIndex(
                  ([e], r) => r < s.length - 1 && t >= e && t <= s[r + 1][0],
                );
              -1 === a && (a = t < s[0][0] ? 0 : s.length - 2);
              let [l, i, o] = s[a],
                [d, c, u] = s[a + 1],
                f =
                  (n = Math.min(
                    1,
                    Math.max(0, (t - l) / Math.max(0.001, d - l)),
                  )) *
                  n *
                  (3 - 2 * n),
                m =
                  (i !== c || o !== u) && f > 0 && f < 1
                    ? 0.004 * Math.sin(9 * t + e.id.length)
                    : 0,
                x = e.say?.find(([e, r]) => t >= e && t <= r)?.[2],
                h =
                  (e.clicks?.length ?? 0) * r +
                  (e.clicks?.filter((e) => e <= t).length ?? 0),
                p = e.select ?? [],
                g = [...p].reverse().find(([e]) => e <= t) ?? p[p.length - 1];
              return {
                id: e.id,
                name: e.name,
                x: i + (c - i) * f + m,
                y: o + (u - o) * f - m,
                message: x,
                clicks: h,
                selection: g?.[1] ?? null,
              };
            })(e, r, t),
          )
          .filter((e) => null !== e),
      );
    }, 100);
    return () => window.clearInterval(e);
  }, []),
    (0, r.useEffect)(() => {
      if (!s) return;
      let e = window.setTimeout(() => a(null), 3600);
      return () => window.clearTimeout(e);
    }, [s]));
  let i = e.map((e) => ("ana" === e.id && s ? { ...e, message: s } : e));
  return (0, t.jsxs)("div", {
    className: "w-full max-w-[560px]",
    children: [
      (0, t.jsxs)("div", {
        className: "mb-2.5 flex items-center justify-between gap-3",
        children: [
          (0, t.jsxs)("div", {
            className: "flex items-center gap-2",
            children: [
              (0, t.jsx)("div", {
                className: "flex -space-x-1.5",
                children: v.map((r, n) => {
                  let s = e.some((e) => e.id === r.id);
                  return (0, t.jsx)(
                    "span",
                    {
                      className:
                        "flex h-6 shrink-0 items-center justify-center overflow-hidden rounded-full border-[1.5px] bg-background text-[10px] font-medium text-foreground",
                      style: {
                        width: 24 * !!s,
                        borderColor: `var(--chart-${n + 1})`,
                        opacity: +!!s,
                        transform: s ? "none" : "scale(0.6)",
                        transition:
                          "opacity 260ms cubic-bezier(0.16,1,0.3,1), transform 260ms cubic-bezier(0.16,1,0.3,1), width 320ms cubic-bezier(0.16,1,0.3,1)",
                      },
                      children: r.name[0],
                    },
                    r.id,
                  );
                }),
              }),
              (0, t.jsxs)("span", {
                className: "text-[12px] text-muted-foreground",
                children: [
                  (0, t.jsx)(m.NumberRoll, { value: e.length }),
                  " here",
                ],
              }),
            ],
          }),
          (0, t.jsxs)("span", {
            className:
              "hidden items-center gap-1 text-[11.5px] text-muted-foreground [@media(pointer:fine)]:flex",
            children: [
              "Press ",
              (0, t.jsx)("kbd", {
                className:
                  "rounded-[4px] border border-border px-1 font-sans text-[10.5px] text-foreground",
                children: "/",
              }),
              " to chat",
            ],
          }),
        ],
      }),
      (0, t.jsx)(f, {
        cursors: i,
        idleAfter: 4e3,
        onMessage: () =>
          window.setTimeout(() => a("Agreed, let’s ship it"), 900),
        className:
          "@container aspect-[4/3] w-full overflow-hidden rounded-[18px] border border-border bg-background bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] sm:aspect-[16/10]",
        children: (0, t.jsxs)("div", {
          "aria-hidden": "true",
          className: "absolute inset-0",
          children: [
            (0, t.jsxs)(j, {
              box: x,
              className:
                "flex items-center justify-between rounded-[8px] border border-border bg-card px-[3%]",
              children: [
                (0, t.jsx)("span", {
                  className: "h-[30%] w-[12%] rounded-full bg-foreground/80",
                }),
                (0, t.jsxs)("span", {
                  className:
                    "flex h-full w-[40%] items-center justify-end gap-[8%]",
                  children: [
                    (0, t.jsx)("span", {
                      className:
                        "h-[18%] w-[18%] rounded-full bg-muted-foreground/30",
                    }),
                    (0, t.jsx)("span", {
                      className:
                        "h-[18%] w-[18%] rounded-full bg-muted-foreground/30",
                    }),
                    (0, t.jsx)("span", {
                      className: "h-[46%] w-[26%] rounded-full bg-primary",
                    }),
                  ],
                }),
              ],
            }),
            (0, t.jsx)(j, {
              box: h,
              className: "flex items-center justify-center",
              children: (0, t.jsx)("span", {
                className:
                  "text-center text-[6.4cqw] font-semibold leading-none tracking-tight text-foreground",
                children: "Ship the pricing page",
              }),
            }),
            (0, t.jsx)(j, {
              box: { x: 0.22, y: 0.4, width: 0.56, height: 0.035 },
              className: "rounded-full bg-muted-foreground/20",
            }),
            (0, t.jsx)(j, {
              box: { x: 0.3, y: 0.46, width: 0.4, height: 0.035 },
              className: "rounded-full bg-muted-foreground/20",
            }),
            (0, t.jsx)(j, {
              box: p,
              className:
                "flex items-center justify-center rounded-full bg-primary",
              children: (0, t.jsx)("span", {
                className: "text-[2.2cqw] font-medium text-primary-foreground",
                children: "Start free",
              }),
            }),
            (0, t.jsx)(j, {
              box: g,
              className:
                "flex items-center justify-center rounded-full border border-border bg-card",
              children: (0, t.jsx)("span", {
                className: "text-[2.2cqw] font-medium text-foreground",
                children: "See pricing",
              }),
            }),
            [y, b, w].map((e, r) =>
              (0, t.jsxs)(
                j,
                {
                  box: e,
                  className:
                    "flex flex-col gap-[8%] rounded-[10px] border border-border bg-card p-[3%]",
                  children: [
                    (0, t.jsx)("span", {
                      className:
                        "aspect-square w-[16%] rounded-[4px] bg-muted-foreground/25",
                    }),
                    (0, t.jsx)("span", {
                      className:
                        "h-[9%] w-[70%] rounded-full bg-muted-foreground/30",
                    }),
                    (0, t.jsx)("span", {
                      className:
                        "h-[9%] w-[50%] rounded-full bg-muted-foreground/20",
                    }),
                  ],
                },
                r,
              ),
            ),
          ],
        }),
      }),
    ],
  });
});
