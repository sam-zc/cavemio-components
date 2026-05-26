"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../icon-factory";
import * as dependency3 from "lucide-react";
import * as dependency4 from "../../../registry/components/selection-actions";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency2;
let i = (0, n.default)("MessageCircleQuestion", [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z", key: "vv11sd" }],
  ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }],
]);
let a = (0, n.default)("Scissors", [
  ["circle", { cx: "6", cy: "6", r: "3", key: "1lh9wr" }],
  ["path", { d: "M8.12 8.12 12 12", key: "1alkpv" }],
  ["path", { d: "M20 4 8.12 15.88", key: "xgtan2" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["path", { d: "M14.8 14.8 20 20", key: "ptml3r" }],
]);
let s = (0, n.default)("Smile", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 14s1.5 2 4 2 4-2 4-2", key: "1y1vjs" }],
  ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9", key: "yxxnd0" }],
  ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9", key: "1p4y9e" }],
]);
var l = dependency3;
let o = (0, n.default)("SpellCheck", [
  ["path", { d: "m6 16 6-12 6 12", key: "1b4byz" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "m16 20 2 2 4-4", key: "13tcca" }],
]);
function S(props) {
  return dependency1.createElement(dependency4.SelectionActions, props);
}
let E =
  "The new pricing page goes live on Monday. Deploy it first thing in the morning so the caches have time to warm up before the launch email goes out. Honestly the onboarding flow is really good too, but we basically need to make sure there is enough servers for the traffic, which gets very heavy after 3pm.";
let M = (e, t) => t.reduce((e, [t, r]) => e.replace(t, r), e);
let N = (e) =>
  e
    .replace(/\b(honestly|really|basically|very|just|actually)\s+/gi, "")
    .replace(/\s{2,}/g, " ")
    .replace(/(^|[.!?]\s+)([a-z])/g, (e, t, r) => t + r.toUpperCase());
let L = (e) =>
  M(N(e), [
    [/warm up/, "fully warm"],
    [/is good too/, "is converting well too"],
    [/make sure there is enough/, "ensure there are enough"],
    [/which gets heavy after 3pm\.?/, "which peaks after 3 p.m."],
  ]);
let _ = {
  improve: L,
  custom: L,
  shorten: (e) =>
    M(N(e), [
      [/ goes live on Monday/, " launches Monday"],
      [
        / first thing in the morning so the caches have time to warm up before the launch email goes out/,
        " early so the caches warm before the email",
      ],
      [
        /but we need to make sure there is enough servers for the traffic, which gets heavy after 3pm/,
        "add servers for the after-3 p.m. peak",
      ],
    ]),
  tone: (e) =>
    M(L(e), [
      [/^Deploy it/, "Let’s deploy it"],
      [/but we need to ensure/, "so let’s make sure"],
      [/\.$/, "!"],
    ]),
  grammar: (e) =>
    M(e, [
      [/Honestly the/, "Honestly, the"],
      [/there is enough servers/, "there are enough servers"],
      [/3pm\.?/, "3 p.m."],
    ]),
};
let A = (e, t) =>
  new Promise((r, n) => {
    let i = window.setTimeout(r, e);
    t.addEventListener("abort", () => (window.clearTimeout(i), n(t.reason)), {
      once: !0,
    });
  });
async function* $({ id: e, text: t, signal: r }) {
  for (let n of (await A(650, r), (_[e] ?? L)(t).match(/\S+\s*/g) ?? []))
    (await A(30 + 40 * Math.random(), r), yield n);
}
export default (function () {
  let [e, n] = (0, r.useState)(E),
    [c, u] = (0, r.useState)("");
  return (0, t.jsxs)("div", {
    className: "w-full max-w-[460px]",
    children: [
      (0, t.jsx)(S, {
        value: e,
        onValueChange: n,
        actions: [
          { id: "explain", label: "Explain", icon: (0, t.jsx)(i, {}) },
          {
            id: "improve",
            label: "Improve",
            icon: (0, t.jsx)(l.Sparkles, {}),
            pendingLabel: "Improving",
          },
        ],
        more: [
          {
            id: "shorten",
            label: "Shorten",
            icon: (0, t.jsx)(a, {}),
            pendingLabel: "Shortening",
          },
          {
            id: "tone",
            label: "Tone",
            icon: (0, t.jsx)(s, {}),
            pendingLabel: "Changing tone",
          },
          {
            id: "grammar",
            label: "Grammar",
            icon: (0, t.jsx)(o, {}),
            pendingLabel: "Fixing grammar",
          },
        ],
        onAction: (e) => {
          if ("explain" !== e.id) return $(e);
          u(e.text);
        },
        className: "text-[14px] leading-7 text-foreground",
      }),
      (0, t.jsx)("p", {
        className: "mt-14 text-[12px] text-muted-foreground",
        children: c
          ? (0, t.jsxs)(t.Fragment, {
              children: [
                "Explain hands “",
                c.length > 48 ? `${c.slice(0, 48)}…` : c,
                "” to your chat.",
              ],
            })
          : e === E
            ? "Select part of the note."
            : (0, t.jsx)("button", {
                type: "button",
                onClick: () => n(E),
                className:
                  "cursor-pointer underline decoration-border underline-offset-4 hover:text-foreground",
                children: "Reset the note",
              }),
      }),
    ],
  });
});
