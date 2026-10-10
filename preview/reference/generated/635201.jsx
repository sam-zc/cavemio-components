"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency5 from "../../../registry/components/json-inspector";
import * as dependency6 from "./25369.jsx";
("use strict");
var t = dependency0;
function $(props) {
  return dependency1.createElement(dependency5.JsonInspector, props);
}
var S = dependency6;
let C = {
  id: "evt_1QxK2mLz8RfY0aTq",
  object: "event",
  type: "invoice.paid",
  created: 0x6ad212b0,
  livemode: !1,
  data: {
    object: {
      id: "in_1QxK2kLz8RfY0aTqv3PZ",
      object: "invoice",
      customer: "cus_R4t9KmZ2Lq",
      customer_email: "maya@fernhill.co",
      amount_due: 4800,
      amount_paid: 4800,
      currency: "usd",
      status: "paid",
      paid_at: "2026-10-16T09:24:00Z",
      period_start: 0x6aaa85b0,
      period_end: 0x6ad212b0,
      lines: {
        object: "list",
        has_more: !1,
        data: [
          {
            id: "il_1QxK2k01",
            description: "Relay Growth × 6 seats",
            amount: 4200,
            quantity: 6,
            price: {
              id: "price_growth_monthly",
              unit_amount: 700,
              recurring: { interval: "month" },
            },
          },
          {
            id: "il_1QxK2k02",
            description: "Extra workspace storage",
            amount: 600,
            quantity: 1,
            price: {
              id: "price_storage_50gb",
              unit_amount: 600,
              recurring: { interval: "month" },
            },
          },
        ],
      },
      metadata: { workspace_id: "ws_fernhill", "x-relay-plan": "growth" },
      discount: null,
    },
  },
  request: {
    id: "req_8Zt2PqVn",
    idempotency_key: "7f4a9c2e-1b6d-4e8a-9c3f-2d5b8a1e6f04",
  },
};
let M = {
  id: "sub_1Pm8Rk",
  plan: "starter",
  seats: 3,
  status: "active",
  cancel_at_period_end: !0,
  items: [
    { id: "si_seats", price: "price_starter_monthly", quantity: 3 },
    { id: "si_storage", price: "price_storage_10gb", quantity: 1 },
  ],
  metadata: { workspace_id: "ws_fernhill", trial_source: "producthunt" },
  current_period_end: "2026-11-16T00:00:00Z",
};
let L = {
  id: "sub_1Pm8Rk",
  plan: "growth",
  seats: 8,
  status: "active",
  cancel_at_period_end: !1,
  items: [
    { id: "si_seats", price: "price_growth_monthly", quantity: 8 },
    { id: "si_storage", price: "price_storage_10gb", quantity: 1 },
    { id: "si_sso", price: "price_sso_addon", quantity: 1 },
  ],
  metadata: { workspace_id: "ws_fernhill" },
  current_period_end: "2026-11-16T00:00:00Z",
};
let T = `{
  "id": "evt_1QxK2mLz8RfY0aTq",
  "type": "invoice.paid",
  "data": {
    "amount_paid": 4800
    "currency": "usd"
  }
}`;
export default (function ({ tab: e = "Webhook" }) {
  return (0, t.jsx)("div", {
    style: (0, S.demoAppearance)(),
    className: "w-full max-w-[560px] text-foreground",
    children:
      "Diff" === e
        ? (0, t.jsx)($, {
            label: "Subscription change",
            title: (0, t.jsxs)("span", {
              children: [
                "Maya changed the subscription ",
                (0, t.jsx)("span", {
                  className: "font-normal text-muted-foreground",
                  children: "· 2 min ago",
                }),
              ],
            }),
            compare: M,
            data: L,
            arrayKey: "id",
            maxHeight: 330,
          })
        : "Broken" === e
          ? (0, t.jsx)($, { label: "Request body", text: T })
          : (0, t.jsx)($, {
              label: "Webhook payload",
              title: (0, t.jsxs)("span", {
                className: "font-mono",
                children: [
                  "invoice.paid ",
                  (0, t.jsx)("span", {
                    className: "font-sans font-normal text-muted-foreground",
                    children: "· 200 in 182 ms",
                  }),
                ],
              }),
              data: C,
              expandDepth: 3,
              defaultQuery: "Search" === e ? "price_" : "",
              maxHeight: 330,
            }),
  });
});
