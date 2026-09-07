"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency6 from "../../../registry/components/voice-input";
("use strict");
var t = dependency0;
var i = dependency1;
var r = dependency2;
function b(props) {
  return dependency1.createElement(dependency6.VoiceInput, props);
}
let y =
  "Summarise the three biggest risks in this launch plan and suggest one fix for each".split(
    " ",
  );
export default (function ({ tab: e = "Live" }) {
  let [s, a] = (0, i.useState)(
      "Blocked" === e ? "blocked" : "Error" === e ? "error" : "idle",
    ),
    [n, o] = (0, i.useState)(0),
    [l, d] = (0, i.useState)(0),
    [c, u] = (0, i.useState)(),
    [m, h] = (0, i.useState)(""),
    x = (0, i.useRef)([]),
    f = () => {
      (x.current.forEach((e) => window.clearInterval(e)), (x.current = []));
    };
  (0, i.useEffect)(() => f, []);
  let p = () => {
      (f(), h(""), d(0), u(Date.now()), a("listening"));
      let e = 0;
      x.current.push(
        window.setInterval(() => {
          let t =
            Math.abs(Math.sin(0.9 * (e += 1))) *
            (0.55 + 0.45 * Math.abs(Math.sin(0.23 * e)));
          o(e % 17 < 3 ? 0.05 : t);
        }, 80),
        window.setInterval(() => d((e) => Math.min(y.length, e + 1)), 260),
      );
    },
    g = () => {
      (f(),
        a("transcribing"),
        x.current.push(
          window.setTimeout(() => {
            (h(y.join(" ")), a("idle"));
          }, 1300),
        ));
    },
    v = () => {
      (f(), a("idle"));
    },
    j = "listening" === s ? y.slice(0, l).join(" ") : void 0;
  return "In a composer" === e
    ? (0, t.jsx)("div", {
        className: "flex w-full max-w-[460px] flex-col gap-3",
        children: (0, t.jsxs)("div", {
          className:
            "relative flex min-h-[52px] items-end gap-1.5 rounded-[26px] border border-border bg-background p-1.5",
          children: [
            (0, t.jsx)("span", {
              "aria-hidden": "true",
              className:
                "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 truncate text-[14px] text-muted-foreground transition-opacity duration-300",
              style: {
                opacity: +("idle" === s),
                maxWidth: "calc(100% - 7rem)",
              },
              children: m ? `“${m}”` : "Ask anything",
            }),
            (0, t.jsx)(b, {
              align: "end",
              status: s,
              level: n,
              transcript: j,
              startedAt: c,
              onStart: p,
              onStop: g,
              onCancel: v,
              className:
                "min-w-0 flex-1 [&>div:first-child_p]:px-2.5 [&>div:first-child_p]:pt-1.5",
            }),
            (0, t.jsx)("button", {
              type: "button",
              "aria-label": "Send",
              disabled: !m || "idle" !== s,
              onClick: () => h(""),
              className:
                "cursor-pointer disabled:cursor-default flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity duration-300 disabled:opacity-35",
              children: (0, t.jsx)(r.ArrowUp, {
                className: "size-4",
                strokeWidth: 2.4,
              }),
            }),
          ],
        }),
      })
    : (0, t.jsxs)("div", {
        className: "flex w-full max-w-[420px] flex-col gap-3",
        children: [
          (0, t.jsx)(b, {
            status: s,
            level: n,
            transcript: j,
            startedAt: c,
            onStart: () =>
              "Live" === e || "In a composer" === e
                ? p()
                : a("Blocked" === e ? "blocked" : "error"),
            onStop: g,
            onCancel: v,
            className: "w-full",
          }),
          "idle" === s &&
            (0, t.jsx)("p", {
              className:
                "text-[12.5px] text-muted-foreground animate-[ui-fade-in_300ms_ease-out_both] motion-reduce:animate-none",
              children: m ? `“${m}”` : "Press the mic to dictate.",
            }),
        ],
      });
});
