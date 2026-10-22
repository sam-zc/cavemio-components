"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency12 from "../../../registry/components/webhooks";
import * as dependency13 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
function P(props) {
  return dependency1.createElement(dependency12.Webhooks, props);
}
var O = dependency13;
let H = [
  "invoice.paid",
  "invoice.payment_failed",
  "customer.created",
  "project.created",
  "project.updated",
  "member.invited",
].map((e) => ({ value: e }));
let U = (e) => new Promise((t) => setTimeout(t, e));
let Y = (e, t) => Math.round(e + Math.random() * (t - e));
let X = 0;
function I(e, t, r, n = {}) {
  let s = "we_northwind" === e.id,
    a = void 0 !== n.status ? n.status : s ? 503 : 200,
    i = `evt_${(++X).toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  return {
    id: `del_${X}`,
    event: t,
    status: a,
    at: r,
    attempt: n.attempt,
    durationMs: null === a ? 1e4 : a >= 500 ? Y(900, 1600) : Y(90, 280),
    request: JSON.stringify({
      id: i,
      type: t,
      created: Math.floor(r / 1e3),
      data: t.startsWith("invoice")
        ? {
            invoice: "in_1Q8f2c",
            amount: 3900,
            currency: "usd",
            customer: "cus_fernhill",
          }
        : { project: "prj_relay_web", by: "u_maya" },
    }),
    response:
      null === a
        ? ""
        : a >= 500
          ? "<html><body><h1>503 Service Unavailable</h1></body></html>"
          : JSON.stringify({ received: !0 }),
  };
}
function K({ tab: e }) {
  let [n, s] = r.default.useState(() =>
      "First endpoint" === e
        ? []
        : [
            {
              id: "we_fernhill",
              url: "https://api.fernhill.co/hooks/relay",
              events: [
                "invoice.paid",
                "invoice.payment_failed",
                "customer.created",
              ],
              enabled: !0,
              lastDelivery: { status: 200, at: new Date(Date.now() - 12e4) },
            },
            {
              id: "we_northwind",
              url: "https://hooks.northwind.dev/relay?team=ops",
              events: ["project.updated"],
              enabled: !0,
              lastDelivery: { status: 503, at: new Date(Date.now() - 384e4) },
            },
          ],
    ),
    a = r.default.useRef({});
  return (0, t.jsx)(P, {
    value: n,
    onValueChange: s,
    events: H,
    appName: "Relay",
    onCreate: async ({ url: e, events: t }) => {
      if ((await U(900), e.includes("example.com")))
        throw Error("example.com never answers. Use your own server.");
      return {
        id: `we_${Date.now()}`,
        url: e,
        events: t,
        enabled: !0,
        lastDelivery: null,
      };
    },
    onTest: async (e, t) => {
      let r = I(e, t, Date.now());
      return (await U(r.durationMs ?? 200), r);
    },
    loadDeliveries: async (e, t) => {
      let r;
      return (await U(600),
      (a.current[e.id] = (t ? (a.current[e.id] ?? 0) : 0) + 1) > 3)
        ? []
        : ((r = t ? new Date(t.at).getTime() : Date.now() - 12e4),
          Array.from({ length: 5 }, (t, n) =>
            I(
              e,
              e.events[n % e.events.length],
              r - (n + 1) * Y(4, 40) * 6e4,
              "we_northwind" === e.id && n > 1 ? { status: 200 } : {},
            ),
          ));
    },
    onRedeliver: async (e, t) => (
      await U(Y(300, 700)),
      I(t, e.event, Date.now(), { status: 200, attempt: (e.attempt ?? 1) + 1 })
    ),
    onRevealSecret: async () => (
      await U(500),
      "whsec_9fK2cQ7vLm4xRt8bN1pZs6WeY3hDa0Uj"
    ),
    onToggle: () => U(700),
    onDelete: () => U(700),
  });
}
export default (function ({ tab: e = "Endpoints" }) {
  return (0, t.jsx)("div", {
    style: (0, O.demoAppearance)(),
    className: "w-full max-w-[620px] text-foreground",
    children: (0, t.jsx)(K, { tab: e }, e),
  });
});
