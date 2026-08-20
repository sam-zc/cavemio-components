"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/streaming-answer";
("use strict");
var t = dependency0;
var n = dependency1;
var r = dependency2;
let s = [
  "Annual plans are your fastest-growing tier: signups are up 23% this month and churn is 8 points below monthly plans.",
  { type: "citation", label: "Q3 report" },
  "\n\nTeams that finish onboarding convert at twice the rate, so a guided setup for new accounts would land well next quarter.",
];
let a = Array.from({ length: 10 }, (e, t) => ({ name: `Source ${t + 1}` }));
export default (function ({ tab: e = "Streaming" }) {
  let [i, o] = (0, n.useState)(0),
    { content: l, finished: c } = (function (e, t, r, s = 45) {
      let a = (0, n.useMemo)(
          () =>
            e.flatMap((e) =>
              "string" == typeof e
                ? e.split(/(?<=\s)/).map((e) => ({ text: e }))
                : [{ citation: e }],
            ),
          [e],
        ),
        i = r ?? a.length,
        [o, l] = (0, n.useState)(0);
      return (
        (0, n.useEffect)(() => {
          l(0);
          let e = window.setInterval(() => l((e) => Math.min(e + 1, i)), s);
          return () => window.clearInterval(e);
        }, [a, t, i, s]),
        {
          content: (0, n.useMemo)(() => {
            let e = [];
            for (let t of a.slice(0, o))
              "citation" in t
                ? e.push(t.citation)
                : "string" == typeof e[e.length - 1]
                  ? (e[e.length - 1] += t.text)
                  : e.push(t.text);
            return e;
          }, [a, o]),
          finished: o >= i,
        }
      );
    })(s, i, "Streaming" === e ? void 0 : 16),
    d = () => o((e) => e + 1),
    u = c
      ? "Stopped" === e
        ? "stopped"
        : "Error" === e
          ? "error"
          : "done"
      : "streaming";
  return (0, t.jsxs)("div", {
    className: "w-full max-w-[400px] text-left",
    children: [
      (0, t.jsx)(r.StreamingText, { content: l, status: u, onRetry: d }),
      (0, t.jsx)(r.AnswerActions, {
        className: "mt-4",
        disabled: "streaming" === u,
        copyText:
          "Annual plans are your fastest-growing tier: signups are up 23% this month and churn is 8 points below monthly plans (Q3 report).",
        onRegenerate: d,
        sources: a,
      }),
      (0, t.jsx)(r.FollowUps, {
        className: "mt-4",
        items: [
          "Which channels bring the most signups",
          "Compare monthly and annual retention",
        ],
        onSelect: d,
      }),
    ],
  });
});
