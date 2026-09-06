"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/number-roll";
import * as dependency3 from "../../../registry/components/text-morph";
import * as dependency5 from "../../../registry/components/trend-chart";
import * as dependency6 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency2;
var a = dependency3;
function b(props) {
  return dependency1.createElement(dependency5.TrendChart, props);
}
var w = dependency6;
let v = "cubic-bezier(0.16,1,0.3,1)";
let $ = [
  { id: "all", label: "All sources" },
  { id: "google", label: "Google" },
  { id: "hn", label: "Hacker News" },
];
let k = { google: "Google", hn: "Hacker News", direct: "Direct", x: "X" };
let j = Array.from(
  { length: 24 },
  (e, t) => 0.25 + Math.exp(-((t - 14.5) ** 2) / 18),
);
let M = j.reduce((e, t) => e + t, 0);
let T = (e) => {
  let t = 43758.5453 * Math.sin(12.9898 * e);
  return t - Math.floor(t);
};
let N = (e) => new Date(e).setHours(0, 0, 0, 0);
let D = (e, t) => {
  let r = new Date(e);
  return (r.setDate(r.getDate() + t), r.getTime());
};
function S(e, t, r, n, a) {
  let o = { google: 0, hn: 0, direct: 0, x: 0 };
  for (let r = N(e); r < t; r = D(r, 1)) {
    let s = (function (e, t) {
      let r = (e - t) / 864e5,
        n = Math.round(r),
        a = new Date(e).getDay(),
        o = 0 === a || 6 === a ? 0.72 : 1,
        s = (310 + 0.9 * n + 60 * T(n)) * o,
        i =
          r >= 0 && r < 6
            ? 2600 * Math.exp(-(0.95 * r)) + 40
            : 6 + 14 * T(n + 3);
      return {
        google: s,
        hn: i,
        direct:
          (120 + 40 * T(n + 7)) * o +
          (r >= 0 && r < 10 ? 220 * Math.exp(-(0.4 * r)) : 0),
        x: 40 + 50 * T(n + 11),
      };
    })(r, n);
    for (let n = 0; n < 24; n++) {
      let i = Math.max(e, r + 36e5 * n),
        l = Math.min(t, a, r + (n + 1) * 36e5);
      if (l <= i) continue;
      let u = (j[n] / M) * ((l - i) / 36e5);
      for (let e of Object.keys(o)) o[e] += s[e] * u;
    }
  }
  return {
    total: Math.round("all" === r ? o.google + o.hn + o.direct + o.x : o[r]),
    top: o,
  };
}
let C = (e) => `${Math.round(100 * e)}%`;
let _ = new Intl.DateTimeFormat(void 0, { day: "numeric", month: "short" });
function R({ shown: e, onClick: r }) {
  return (0, t.jsx)("span", {
    className:
      "grid transition-[grid-template-columns,opacity,filter] duration-300",
    style: {
      gridTemplateColumns: e ? "1fr" : "0fr",
      opacity: +!!e,
      filter: e ? "none" : "blur(3px)",
      transitionTimingFunction: v,
    },
    children: (0, t.jsx)("span", {
      className: "min-w-0 [clip-path:inset(-4px_-2px)]",
      children: (0, t.jsxs)("button", {
        type: "button",
        onClick: r,
        tabIndex: e ? 0 : -1,
        "aria-hidden": !e,
        className:
          "flex h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[12.5px] text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)] transition-colors duration-200 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40",
        children: [
          (0, t.jsx)("svg", {
            "aria-hidden": "true",
            viewBox: "0 0 16 16",
            className: "size-3.5",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: (0, t.jsx)("path", { d: "M10 3.5 5.5 8l4.5 4.5" }),
          }),
          "Back",
        ],
      }),
    }),
  });
}
function A({ value: e, onChange: n, className: a = "" }) {
  let o = r.default.useRef([]),
    [s, i] = r.default.useState({ x: 0, w: 0, ready: !1 }),
    l = $.findIndex((t) => t.id === e);
  r.default.useLayoutEffect(() => {
    let e = () => {
      let e = o.current[l];
      e &&
        i((t) =>
          t.x === e.offsetLeft && t.w === e.offsetWidth
            ? t
            : { x: e.offsetLeft, w: e.offsetWidth, ready: t.w > 0 },
        );
    };
    e();
    let t = new ResizeObserver(e);
    return (o.current.forEach((e) => e && t.observe(e)), () => t.disconnect());
  }, [l]);
  let u = (e) => {
    let t = $[(e + $.length) % $.length];
    (n(t.id), o.current[$.indexOf(t)]?.focus());
  };
  return (0, t.jsxs)("div", {
    role: "radiogroup",
    "aria-label": "Source",
    className: `relative inline-flex h-8 max-w-full rounded-full p-[3px] shadow-[inset_0_0_0_1px_var(--border)] ${a}`,
    children: [
      (0, t.jsx)("span", {
        "aria-hidden": "true",
        className:
          "absolute top-[3px] left-0 h-[26px] rounded-full bg-accent shadow-[inset_0_0_0_1px_var(--border)]",
        style: {
          width: s.w,
          transform: `translateX(${s.x}px)`,
          transition: s.ready
            ? `transform 420ms cubic-bezier(0.34,1.36,0.64,1), width 420ms ${v}`
            : "none",
        },
      }),
      $.map((r, a) =>
        (0, t.jsx)(
          "button",
          {
            ref: (e) => {
              o.current[a] = e;
            },
            type: "button",
            role: "radio",
            "aria-checked": r.id === e,
            tabIndex: r.id === e ? 0 : -1,
            onClick: () => n(r.id),
            onKeyDown: (e) => {
              (("ArrowRight" === e.key || "ArrowDown" === e.key) &&
                (e.preventDefault(), u(a + 1)),
                ("ArrowLeft" === e.key || "ArrowUp" === e.key) &&
                  (e.preventDefault(), u(a - 1)));
            },
            className: `relative cursor-pointer whitespace-nowrap rounded-full px-3 text-[12.5px] outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/40 ${r.id === e ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`,
            children: r.label,
          },
          r.id,
        ),
      ),
    ],
  });
}
export default (function ({ tab: e = "Visitors" }) {
  let [o] = r.default.useState(() => Date.now()),
    s = N(o),
    i = D(s, -12),
    l = "Unfinished day" === e,
    u = "Zoom" === e ? 60 : l ? 14 : 30,
    d = r.default.useMemo(() => {
      let e = l ? D(s, 1) : s;
      return { start: D(e, -u), end: e };
    }, [s, u, l]),
    [m, c] = r.default.useState(null),
    [h, p] = r.default.useState("all"),
    [f, x] = r.default.useState("Compare" === e),
    y = m ?? d,
    g = y.end - y.start <= 1764e5 ? "hour" : "day",
    v = r.default.useMemo(() => {
      let e = (function (e, t, r) {
          let n = [];
          for (let a = e; a < t; a = "hour" === r ? a + 36e5 : D(a, 1))
            n.push(a);
          return n;
        })(y.start, y.end, g),
        t = (e) => ("hour" === g ? e + 36e5 : D(e, 1)),
        r = e.map((e) => S(e, t(e), h, i, o)),
        n = (e) => e - (y.end - y.start),
        a = f ? e.map((e) => S(n(e), n(t(e)), h, i, o).total) : null;
      return {
        buckets: e,
        values: r.map((e) => e.total),
        previous: a,
        tops: r.map((e) => e.top),
      };
    }, [y.start, y.end, g, h, f, i, o]),
    $ = v.values.reduce((e, t) => e + t, 0),
    j = v.previous?.reduce((e, t) => e + t, 0) ?? 0,
    M = v.previous && j > 0 ? ($ - j) / j : null,
    T = r.default.useCallback(
      (e) => {
        let t = v.tops[e],
          r = t.google + t.hn + t.direct + t.x;
        if (!r) return null;
        if ("all" !== h) return `${C(t[h] / r)} of all visitors`;
        let [n, a] = Object.entries(t).sort((e, t) => t[1] - e[1])[0];
        return `${C(a / r)} from ${k[n]}`;
      },
      [v.tops, h],
    ),
    F = m
      ? "hour" === g
        ? `${_.format(m.start)}${m.end - m.start > 864e5 ? ` – ${_.format(m.end - 1)}` : ""}, hourly`
        : `${_.format(m.start)} – ${_.format(m.end - 1)}`
      : l
        ? "Last 14 days, today so far"
        : `Last ${u} days`;
  return (0, t.jsx)("div", {
    style: (0, w.demoAppearance)(),
    className: "w-full max-w-[720px] text-foreground",
    children: (0, t.jsxs)("div", {
      className: "rounded-[22px] border border-border bg-background p-4 sm:p-5",
      children: [
        (0, t.jsxs)("div", {
          className:
            "flex flex-wrap items-start justify-between gap-x-4 gap-y-3",
          children: [
            (0, t.jsxs)("div", {
              className: "min-w-0",
              children: [
                (0, t.jsxs)("p", {
                  className: "text-[13px] text-muted-foreground",
                  children: [
                    "Visitors · ",
                    (0, t.jsx)(a.TextMorph, { children: F }),
                  ],
                }),
                (0, t.jsxs)("p", {
                  className: "mt-1 flex items-baseline gap-2",
                  children: [
                    (0, t.jsx)("span", {
                      className:
                        "text-[28px] font-semibold leading-none tracking-[-0.035em] tabular-nums",
                      children: (0, t.jsx)(n.NumberRoll, { value: $ }),
                    }),
                    (0, t.jsxs)("span", {
                      className: `text-[12.5px] tabular-nums transition-[opacity,filter] duration-300 ${null !== M && M < 0 ? "text-red-600 dark:text-red-400" : "text-emerald-600 dark:text-emerald-400"}`,
                      style: {
                        opacity: +(null !== M),
                        filter: null === M ? "blur(3px)" : "none",
                      },
                      "aria-hidden": null === M,
                      children: [
                        null !== M && M < 0 ? "↓" : "↑",
                        " ",
                        (0, t.jsx)(n.NumberRoll, {
                          value: Math.abs((M ?? 0) * 100),
                          format: { maximumFractionDigits: 0 },
                          suffix: "%",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            (0, t.jsxs)("div", {
              className: "flex flex-wrap items-center gap-2",
              children: [
                (0, t.jsx)(R, { shown: !!m, onClick: () => c(null) }),
                (0, t.jsxs)("button", {
                  type: "button",
                  "aria-pressed": f,
                  onClick: () => x((e) => !e),
                  className: `flex h-8 cursor-pointer items-center gap-2 rounded-full px-3 text-[12.5px] shadow-[inset_0_0_0_1px_var(--border)] transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring/40 ${f ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`,
                  children: [
                    (0, t.jsx)("span", {
                      "aria-hidden": "true",
                      className: `w-3 border-t border-dashed transition-colors duration-200 ${f ? "border-foreground" : "border-muted-foreground"}`,
                    }),
                    "Compare",
                  ],
                }),
              ],
            }),
          ],
        }),
        (0, t.jsx)(A, { value: h, onChange: p, className: "mt-4" }),
        (0, t.jsx)(b, {
          className: "mt-5",
          buckets: v.buckets,
          values: v.values,
          previous: v.previous,
          interval: g,
          unit: "visitors",
          now: o,
          onZoom: c,
          note: T,
          label: `Visitors to fernhill.app, ${F}`,
        }),
        (0, t.jsx)("p", {
          className: "mt-3 text-[11.5px] text-muted-foreground",
          children: l
            ? "Today isn’t over yet, so its line is dashed."
            : m
              ? "Drag again to zoom further, or Back to see the whole range."
              : "Drag across the chart to zoom into those days.",
        }),
      ],
    }),
  });
});
