"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency7 from "../../../registry/components/poll";
("use strict");
var a = dependency0;
var t = dependency1;
function h(props) {
  return dependency1.createElement(dependency7.Poll, props);
}
let f = [
  { id: "offline", label: "Offline mode", votes: 412 },
  { id: "calendar", label: "Calendar sync", votes: 389 },
  { id: "api", label: "Public API", votes: 266 },
  { id: "docs", label: "Dark mode for docs", votes: 117 },
];
let g = [
  { id: "iris", name: "Iris Okafor" },
  { id: "theo", name: "Theo Brandt" },
  { id: "sana", name: "Sana Rafi" },
];
function v({ tab: e }) {
  let [r, n] = (0, t.useState)(f),
    [s, l] = (0, t.useState)("Closed" === e ? "api" : null),
    [i] = (0, t.useState)(() =>
      "Closed" === e ? Date.now() - 864e5 : Date.now() + 1728e5 + 36e5,
    );
  return (
    (0, t.useEffect)(() => {
      if ("Live" !== e) return;
      let a = window.setInterval(() => {
        let e = Math.random(),
          a =
            e < 0.38
              ? "calendar"
              : e < 0.7
                ? "offline"
                : e < 0.9
                  ? "api"
                  : "docs";
        n((e) =>
          e.map((e) =>
            e.id === a
              ? { ...e, votes: e.votes + 1 + Math.floor(3 * Math.random()) }
              : e,
          ),
        );
      }, 1300);
      return () => window.clearInterval(a);
    }, [e]),
    (0, a.jsx)(h, {
      source: "Relay community",
      question: "What should Relay build next?",
      options: r,
      vote: s,
      voters: g,
      closesAt: i,
      locale: "en-US",
      onVote: async (e) => {
        (await new Promise((e) => setTimeout(e, 600)),
          n((a) =>
            a.map((a) => ({
              ...a,
              votes: a.votes + +(a.id === e) - (a.id === s),
            })),
          ),
          l(e));
      },
    })
  );
}
export default (function ({ tab: e = "Vote" }) {
  return (0, a.jsx)(v, { tab: e }, e);
});
