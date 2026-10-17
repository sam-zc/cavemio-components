"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency9 from "../../../registry/components/order-status";
("use strict");
var t = dependency0;
var r = dependency1;
function v(props) {
  return dependency1.createElement(dependency9.OrderStatus, props);
}
let y = [
  { status: "ordered", title: "Order placed" },
  {
    status: "packed",
    title: "Packed and ready",
    place: "Fernhill warehouse, Leeds",
  },
  { status: "shipped", title: "Handed to the carrier", place: "Leeds depot" },
  { status: "out", title: "Out for delivery", place: "Manchester" },
  {
    status: "delivered",
    title: "Delivered, left with a neighbour",
    place: "No. 14",
  },
];
function b({ tab: e }) {
  let [a, s] = (0, r.useState)(() => {
    let t = Date.now(),
      r = "Delivered" === e ? 4 : +("Live" === e),
      a = y
        .slice(0, r + 1)
        .map((e, a) => ({
          id: e.status,
          at: t - (r - a) * 18e6,
          title: e.title,
          place: e.place,
        }))
        .reverse();
    return { at: r, events: a, eta: 4 === r ? t : t + 1728e5 };
  });
  return (
    (0, r.useEffect)(() => {
      if ("Live" !== e) return;
      let t = window.setInterval(() => {
        s((e) => {
          if (e.at >= y.length - 1) return e;
          let t = y[e.at + 1],
            r = Date.now();
          return {
            at: e.at + 1,
            events: [
              { id: t.status, at: r, title: t.title, place: t.place },
              ...e.events,
            ],
            eta: "out" === t.status || "delivered" === t.status ? r : e.eta,
          };
        });
      }, 3200);
      return () => window.clearInterval(t);
    }, [e]),
    (0, t.jsx)(v, {
      number: "HL-2048",
      status: y[a.at].status,
      eta: a.eta,
      window: a.at >= 3 ? "by 6pm" : void 0,
      address: "12 Elm Street, Leeds",
      carrier: "DPD",
      tracking: a.at >= 2 ? "15501 2048 7731" : void 0,
      trackingUrl:
        a.at >= 2 ? "https://example.com/track/15501204877731" : void 0,
      events: a.events,
      locale: "en-US",
      onCancel:
        "Cancel" === e
          ? async () => {
              await new Promise((e) => setTimeout(e, 900));
            }
          : void 0,
    })
  );
}
export default (function ({ tab: e = "Live" }) {
  return (0, t.jsx)(b, { tab: e }, e);
});
