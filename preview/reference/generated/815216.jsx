"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency8 from "../../../registry/components/api-keys";
import * as dependency9 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
function S(props) {
  return dependency1.createElement(dependency8.ApiKeys, props);
}
var R = dependency9;
let C = [
  { value: "read", label: "Read" },
  { value: "write", label: "Write" },
  { value: "billing", label: "Billing" },
];
let M = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789";
let T = (e) => new Promise((t) => setTimeout(t, e));
let E = (e) => new Date(Date.now() - e);
function D({ tab: e }) {
  let [n, a] = r.default.useState(() =>
      "First key" === e
        ? []
        : [
            {
              id: "key_prod",
              name: "Production server",
              prefix: "sk_live_",
              last4: "4f2a",
              scopes: ["read", "write"],
              createdAt: E(28512e5),
              lastUsedAt: E(12e4),
            },
            {
              id: "key_staging",
              name: "Staging",
              prefix: "sk_test_",
              last4: "91bd",
              scopes: ["read", "write"],
              createdAt: E(61344e5),
              lastUsedAt: E(108e5),
            },
            {
              id: "key_export",
              name: "Analytics export",
              prefix: "sk_live_",
              last4: "c07e",
              scopes: ["read"],
              createdAt: E(101952e5),
              lastUsedAt: E(10368e5),
            },
          ],
    ),
    s = r.default.useRef(
      "Errors" === e ? { create: 1, revoke: 1 } : { create: 0, revoke: 0 },
    ),
    i = r.default.useRef(0),
    o = (e, t, r = "sk_live_") => {
      let n =
        r +
        Array.from(
          { length: 40 },
          () => M[Math.floor(Math.random() * M.length)],
        ).join("");
      return {
        key: {
          id: `key_${Date.now()}_${++i.current}`,
          name: e,
          prefix: r,
          last4: n.slice(-4),
          scopes: t,
          createdAt: new Date(),
          lastUsedAt: null,
        },
        secret: n,
      };
    };
  return (0, t.jsx)(S, {
    value: n,
    onValueChange: a,
    scopes: C,
    defaultScopes: ["read"],
    onCreate: async ({ name: e, scopes: t }) => {
      if ((await T(900), s.current.create > 0))
        throw (
          s.current.create--,
          Error("Starter allows four live keys. Revoke one, or try again.")
        );
      return o(e, t);
    },
    onRoll: async (e) => (
      await T(900),
      {
        ...o(e.name, e.scopes ?? [], e.prefix),
        previous: {
          ...e,
          name: `${e.name} (old)`,
          expiresAt: new Date(Date.now() + 864e5),
        },
      }
    ),
    onRevoke: async () => {
      if ((await T(700), s.current.revoke > 0))
        throw (s.current.revoke--, Error("Network"));
    },
  });
}
export default (function ({ tab: e = "Keys" }) {
  return (0, t.jsx)("div", {
    style: (0, R.demoAppearance)(),
    className: "w-full max-w-[560px] text-foreground",
    children: (0, t.jsx)(D, { tab: e }, e),
  });
});
