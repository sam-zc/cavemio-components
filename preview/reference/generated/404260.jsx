"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency11 from "../../../registry/components/booking";
("use strict");
var t = dependency0;
var r = dependency1;
function F(props) {
  return dependency1.createElement(dependency11.Booking, props);
}
let z = (e) => new Promise((t) => setTimeout(t, e));
export default (function ({ tab: e = "Book a call" }) {
  let a = (0, r.useRef)(new Set()),
    n = async ({ from: t, to: r }) => (
      await z(520),
      (function (e, t, r, a) {
        let n = Date.now();
        if (a && e.getTime() < n + 2592e5) return [];
        let s = [];
        for (
          let a = new Date(e);
          a < t;
          a = new Date(a.getFullYear(), a.getMonth(), a.getDate() + 1)
        ) {
          let e = a.getDay();
          if (0 !== e && 6 !== e)
            for (let t = 18; t < 34; t++) {
              let i = new Date(
                  a.getFullYear(),
                  a.getMonth(),
                  a.getDate(),
                  Math.floor(t / 2),
                  (t % 2) * 30,
                ),
                l = (7 * i.getDate() + 13 * t) % 5 == 0 || (5 === e && t >= 26);
              !(i.getTime() > n + 72e5) || l || r.has(i.getTime()) || s.push(i);
            }
        }
        return s;
      })(t, r, a.current, "Fully booked" === e)
    ),
    s = async (t) => {
      if ((await z(1100), "Time taken" === e))
        throw (
          a.current.add(t.start.getTime()),
          Error("Someone just booked that time. Pick another one.")
        );
      return {
        id: `bk_${t.start.getTime().toString(36)}`,
        meetingUrl: "https://relay.example/call/maya",
      };
    },
    i = async () => {
      await z(800);
    };
  return (0, t.jsx)(
    F,
    {
      host: { name: "Maya Lindqvist", role: "Founder, Relay" },
      title: "Relay walkthrough",
      description:
        "Thirty minutes to see Relay on your own projects, and what it would take to switch.",
      duration: 30,
      location: "Google Meet",
      getSlots: n,
      onBook: s,
      onCancel: i,
      locale: "en-US",
    },
    e,
  );
});
