"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/number-roll";
import * as dependency3 from "../../../registry/components/text-morph";
import * as dependency5 from "../../../registry/components/time-brush";
import * as dependency6 from "../../../registry/components/time-range-parse";
import * as dependency7 from "../../../registry/components/time-range-picker";
import * as dependency8 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency2;
var a = dependency3;
var i = dependency5;
var s = dependency6;
function w(props) {
  return dependency1.createElement(dependency7.TimeRangePicker, props);
}
var v = dependency8;
let $ = (e) => String(e).padStart(2, "0");
let T = (e) => `${$(e.getHours())}:${$(e.getMinutes())}`;
export default (function ({ tab: e = "Live" }) {
  let [o, l] = r.default.useState(() => ({
      type: "relative",
      duration: "Drag to zoom" === e ? 216e5 : 36e5,
    })),
    [d, u] = r.default.useState(() => Date.now()),
    [m] = r.default.useState(() => Date.now() - 21e5),
    c = "absolute" !== o.type;
  r.default.useEffect(() => {
    if (!c) return;
    let e = window.setInterval(() => u(Date.now()), 5e3);
    return () => window.clearInterval(e);
  }, [c]);
  let { start: p, end: f } = (0, s.resolveTimeRange)(o, new Date(d)),
    h = (f.getTime() - p.getTime()) / 40,
    x = Array.from({ length: 40 }, (e, t) => {
      let r = 0,
        n = 0;
      for (let e = 0; e < 4; e++) {
        let a = (function (e, t) {
          let r = 43758.5453 * Math.sin(12.9898 * Math.floor(e / 6e4)),
            n = r - Math.floor(r),
            a =
              30 +
              22 * Math.sin(((((e / 36e5) % 24) - 8) / 24) * Math.PI * 2) +
              14 * n,
            o = e > t - 9e5 && e < t;
          return {
            total: a + 70 * !!o,
            errors: o ? 48 + 20 * n : 3 * (n > 0.86),
          };
        })(p.getTime() + (t + (e + 0.5) / 4) * h, m);
        ((r += a.total), (n += a.errors));
      }
      let a = h / 6e4 / 4;
      return { total: r * a, errors: n * a };
    }),
    g = Math.max(...x.map((e) => e.total)),
    y = Math.round(x.reduce((e, t) => e + t.total, 0)),
    b = Math.round(x.reduce((e, t) => e + t.errors, 0));
  return (0, t.jsx)("div", {
    style: (0, v.demoAppearance)(),
    className: "w-full max-w-[560px] text-foreground",
    children: (0, t.jsxs)("div", {
      className: "rounded-[22px] border border-border bg-background p-4 sm:p-5",
      children: [
        (0, t.jsxs)("div", {
          className:
            "flex flex-wrap items-center justify-between gap-x-3 gap-y-2.5",
          children: [
            (0, t.jsxs)("div", {
              className: "min-w-0",
              children: [
                (0, t.jsx)("p", {
                  className: "text-[14px] font-medium tracking-[-0.01em]",
                  children: "Logs",
                }),
                (0, t.jsx)("p", {
                  className:
                    "mt-0.5 font-mono text-[11px] text-muted-foreground",
                  children: "relay-api · production",
                }),
              ],
            }),
            (0, t.jsx)(w, {
              label: "Time range for logs",
              value: o,
              onValueChange: l,
              defaultOpen: "Type a range" === e,
            }),
          ],
        }),
        (0, t.jsx)(i.TimeBrush, {
          className: "mt-9",
          start: p,
          end: f,
          onSelect: (e) => l({ type: "absolute", start: e.start, end: e.end }),
          children: (0, t.jsx)("div", {
            className:
              "flex h-[96px] items-end gap-[2px] border-b border-border",
            role: "img",
            "aria-label": `Log volume, ${(0, s.formatTimeRange)(o)}: ${y} events, ${b} errors`,
            children: x.map((e, r) =>
              (0, t.jsx)(
                "div",
                {
                  className:
                    "flex h-full min-w-0 max-w-[24px] flex-1 flex-col justify-end",
                  children: (0, t.jsx)("div", {
                    className:
                      "flex flex-col justify-end overflow-hidden rounded-t-[3px] transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    style: {
                      height: `${Math.max(2, (e.total / g) * 100)}%`,
                      background:
                        "color-mix(in oklab, var(--chart-1) 70%, transparent)",
                    },
                    children: (0, t.jsx)("div", {
                      className:
                        "bg-red-500/85 transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                      style: { height: `${(e.errors / e.total) * 100}%` },
                    }),
                  }),
                },
                r,
              ),
            ),
          }),
        }),
        (0, t.jsxs)("div", {
          className:
            "mt-1.5 flex justify-between font-mono text-[10.5px] tabular-nums text-muted-foreground",
          children: [
            (0, t.jsx)(a.TextMorph, { children: T(p) }),
            (0, t.jsx)(a.TextMorph, { children: c ? "now" : T(f) }),
          ],
        }),
        (0, t.jsxs)("div", {
          className:
            "mt-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-[12.5px]",
          children: [
            (0, t.jsxs)("p", {
              className: "tabular-nums",
              children: [
                (0, t.jsx)(n.NumberRoll, { value: y }),
                " ",
                (0, t.jsx)("span", {
                  className: "text-muted-foreground",
                  children: "events ·",
                }),
                " ",
                (0, t.jsx)(n.NumberRoll, {
                  value: b,
                  className: "text-red-600 dark:text-red-400",
                }),
                " ",
                (0, t.jsx)("span", {
                  className: "text-muted-foreground",
                  children: "errors",
                }),
              ],
            }),
            (0, t.jsx)("p", {
              className: "text-[11.5px] text-muted-foreground",
              children:
                "Drag to zoom" === e
                  ? "Drag across the red to zoom in"
                  : "Drag across the chart to zoom",
            }),
          ],
        }),
      ],
    }),
  });
});
