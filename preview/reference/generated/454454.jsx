"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency7 from "../../../registry/components/domain-connect";
import * as dependency8 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
function T(props) {
  return dependency1.createElement(dependency7.DomainConnect, props);
}
var E = dependency8;
let M = (e, t) =>
  new Promise((r, n) => {
    let s = setTimeout(r, e);
    t?.addEventListener("abort", () => {
      (clearTimeout(s), n(new DOMException("Aborted", "AbortError")));
    });
  });
let z = (e) => {
  let t = e.split(".").length > 2 ? e.split(".")[0] : "@";
  return [
    { type: "CNAME", name: t, value: "cname.relay-dns.com", status: "pending" },
    {
      type: "TXT",
      name: `_relay-challenge${"@" === t ? "" : `.${t}`}`,
      value: "relay-verify=8f2c41d07be9a6",
      status: "pending",
    },
  ];
};
let R = (e, t) => {
  let r = z(e).map((e, r) => ({
    ...e,
    status: t > r ? "verified" : "pending",
  }));
  return t >= 4
    ? { domain: e, status: "active", records: r }
    : t >= 2
      ? { domain: e, status: "issuing", records: r }
      : { domain: e, status: "pending", records: r };
};
let D = {
  Connect: () => null,
  Waiting: () => R("app.fernhill.co", 0),
  "Wrong record": () => ({
    domain: "app.fernhill.co",
    status: "failed",
    records: z("app.fernhill.co").map((e, t) => ({
      ...e,
      status: 0 === t ? "failed" : "verified",
    })),
    message:
      "The CNAME for app points at ghs.googlehosted.com. Change it to cname.relay-dns.com, then check again.",
  }),
  Live: () => R("app.fernhill.co", 4),
};
function L({ tab: e }) {
  let [n, s] = r.default.useState(() => (D[e] ?? D.Connect)()),
    a = r.default.useRef(0);
  return (0, t.jsx)(T, {
    value: n,
    onValueChange: s,
    schedule: [4, 5, 6],
    onAdd: async (e) => {
      if ((await M(900), e.endsWith(".local")))
        throw Error(".local addresses only work on your own network.");
      return ((a.current = 0), R(e, 0));
    },
    check: async (e, { signal: t }) => (
      await M(1100, t),
      (a.current += 1),
      R(e, a.current)
    ),
    onRemove: () => M(600),
  });
}
export default (function ({ tab: e = "Connect" }) {
  return (0, t.jsx)("div", {
    style: (0, E.demoAppearance)(),
    className: "w-full max-w-[580px] text-foreground",
    children: (0, t.jsx)(L, { tab: e }, e),
  });
});
