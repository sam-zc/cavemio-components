"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency11 from "../../../registry/components/subscription";
("use strict");
var t = dependency0;
var r = dependency1;
function j(props) {
  return dependency1.createElement(dependency11.Subscription, props);
}
let k = (e) => new Promise((t) => setTimeout(t, e));
function N({ tab: e }) {
  let [a, n] = (0, r.useState)(() => {
    let t = Date.now();
    return {
      status:
        "Payment failed" === e
          ? "past_due"
          : "Paused" === e
            ? "paused"
            : "active",
      start: t - 10368e5,
      end: t + 15552e5,
      resumesAt: t + 41472e5,
      invoices: [
        {
          id: "in3",
          date: t - 10368e5,
          amount: 120,
          status: "Payment failed" === e ? "failed" : "paid",
          url: "#",
        },
        { id: "in2", date: t - 36288e5, amount: 120, status: "paid", url: "#" },
        { id: "in1", date: t - 63072e5, amount: 96, status: "paid", url: "#" },
      ],
    };
  });
  return (0, t.jsx)(j, {
    plan: { name: "Relay Pro", price: 120, interval: "month", seats: 5 },
    status: a.status,
    periodStart: a.start,
    periodEnd: a.end,
    resumesAt: a.resumesAt,
    usage: [
      {
        id: "runs",
        label: "Deploy runs",
        used: "Payment failed" === e ? 9620 : 8420,
        limit: 1e4,
      },
      { id: "storage", label: "Storage", used: 18.2, limit: 50, unit: "GB" },
    ],
    card: { brand: "Visa", last4: "4242", expMonth: 8, expYear: 2027 },
    invoices: a.invoices,
    locale: "en-US",
    onUpdateCard: async () => {
      await k(800);
    },
    onChangePlan: () => {},
    onPause: async (e) => {
      (await k(1e3),
        n((t) => ({
          ...t,
          status: "paused",
          resumesAt: new Date(t.end).setMonth(new Date(t.end).getMonth() + e),
        })));
    },
    onCancel: async () => {
      (await k(1100), n((e) => ({ ...e, status: "canceling" })));
    },
    onResume: async () => {
      (await k(900), n((e) => ({ ...e, status: "active" })));
    },
  });
}
export default (function ({ tab: e = "Active" }) {
  return (0, t.jsx)(N, { tab: e }, e);
});
