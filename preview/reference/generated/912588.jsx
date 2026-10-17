"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency11 from "../../../registry/components/referral";
("use strict");
var t = dependency0;
var r = dependency1;
function k(props) {
  return dependency1.createElement(dependency11.Referral, props);
}
let j = (e) => new Promise((t) => setTimeout(t, e));
function $(e) {
  return "Unlock" === e
    ? [
        {
          id: "theo",
          email: "theo@northwind.io",
          name: "Theo Brandt",
          status: "invited",
        },
        {
          id: "sana",
          email: "sana@fernhill.co",
          name: "Sana Rafi",
          status: "joined",
        },
        { id: "iris", email: "iris.okafor@gmail.com", status: "joined" },
      ]
    : [
        {
          id: "jonah",
          email: "jonah@kept.co",
          name: "Jonah Wells",
          status: "invited",
        },
        { id: "iris", email: "iris.okafor@gmail.com", status: "joined" },
      ];
}
function N({ tab: e }) {
  let [a, n] = (0, r.useState)(() => $(e)),
    i = (0, r.useRef)([]),
    s = (e, t) =>
      i.current.push(
        window.setTimeout(
          () =>
            n((t) =>
              t.map((t) => (t.id === e ? { ...t, status: "joined" } : t)),
            ),
          t,
        ),
      );
  return (
    (0, r.useEffect)(() => {
      let t = i.current,
        r = $(e).find((e) => "invited" === e.status);
      return (
        r && "Invite limit" !== e && s(r.id, 2200),
        () => t.forEach((e) => window.clearTimeout(e))
      );
    }, [e]),
    (0, t.jsx)(k, {
      link: "https://relay.so/r/kai-7f3q",
      friends: a,
      goal: 3,
      reward: "a free month of Pro",
      offer: "Friends get 20% off their first year.",
      onInvite: async (t) => {
        if ((await j(900), "Invite limit" === e))
          throw Error("You can send 10 invites a day. Try again tomorrow.");
        let r = t.map((e) => ({ id: e, email: e, status: "invited" }));
        (n((e) => [...r, ...e]), r.forEach((e, t) => s(e.id, 2600 + 900 * t)));
      },
      onClaim: async () => {
        await j(1e3);
      },
    })
  );
}
export default (function ({ tab: e = "Friend joins" }) {
  return (0, t.jsx)(N, { tab: e }, e);
});
