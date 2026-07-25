"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency5 from "../../../registry/components/log-stream";
import * as dependency6 from "./25369.jsx";
("use strict");
var r = dependency0;
var t = dependency1;
function y(props) {
  return dependency1.createElement(dependency5.LogStream, props);
}
var j = dependency6;
let N = 0;
let _ = (e) => e[Math.floor(Math.random() * e.length)];
let S = (e, r) => Math.round(e + Math.random() * (r - e));
let k = [
  "/api/projects",
  "/api/invites",
  "/api/keys",
  "/api/webhooks/deliveries",
  "/api/settings",
  "/api/search",
];
let $ = ["u_maya", "u_leo", "u_ana", "u_sam", "u_priya"];
function T(e) {
  let r = Math.random(),
    t = r < 0.06 ? "error" : r < 0.16 ? "warn" : r < 0.8 ? "info" : "debug",
    n = `l${++N}`,
    a = _(k),
    s = S(8, 240);
  return "error" === t
    ? _([
        {
          id: n,
          at: e,
          level: t,
          source: "api",
          message: "POST /api/billing/portal 500: upstream timed out after 10s",
          data: {
            requestId: `req_${n}`,
            path: "/api/billing/portal",
            status: 500,
            duration_ms: 10012,
            user: _($),
          },
        },
        {
          id: n,
          at: e,
          level: t,
          source: "worker",
          message: "Unhandled rejection in sync-calendars: ECONNRESET",
          data: {
            job: "sync-calendars",
            attempt: 3,
            host: "calendar.fernhill.co",
          },
        },
      ])
    : "warn" === t
      ? _([
          {
            id: n,
            at: e,
            level: t,
            source: "api",
            message: `Slow query on deliveries (${S(600, 1400)}ms)`,
            data: {
              table: "deliveries",
              rows: S(800, 4e3),
              duration_ms: S(600, 1400),
            },
          },
          {
            id: n,
            at: e,
            level: t,
            source: "worker",
            message: `Retrying webhook to api.northwind.dev (attempt ${S(2, 4)})`,
            data: {
              endpoint: "https://api.northwind.dev/hooks/relay",
              status: 503,
            },
          },
        ])
      : "debug" === t
        ? _([
            {
              id: n,
              at: e,
              level: t,
              source: "edge",
              message: `ratelimit ${S(10, 58)}/60 for 203.0.113.${S(2, 250)}`,
            },
            {
              id: n,
              at: e,
              level: t,
              source: "api",
              message: `session refreshed for ${_($)}`,
            },
          ])
        : _([
            {
              id: n,
              at: e,
              level: t,
              source: "api",
              message: `GET ${a} 200 in ${s}ms`,
              data: {
                requestId: `req_${n}`,
                path: a,
                status: 200,
                duration_ms: s,
                user: _($),
              },
            },
            {
              id: n,
              at: e,
              level: t,
              source: "api",
              message: `POST ${a} 201 in ${s + 40}ms`,
              data: {
                requestId: `req_${n}`,
                path: a,
                status: 201,
                duration_ms: s + 40,
              },
            },
            {
              id: n,
              at: e,
              level: t,
              source: "cron",
              message: `digest-emails sent ${S(20, 140)} emails in ${(3 * Math.random() + 0.4).toFixed(1)}s`,
            },
            {
              id: n,
              at: e,
              level: t,
              source: "worker",
              message: `sync-calendars finished in ${(2 * Math.random() + 0.2).toFixed(1)}s`,
            },
          ]);
}
let C = (e, r) => {
  let t = [],
    n = r;
  for (let r = 0; r < e; r++) t.unshift((n -= S(400, 2200)));
  return t.map((e) => T(e));
};
function R({ tab: e }) {
  let [n] = t.default.useState(() => C("History" === e ? 40 : 24, Date.now())),
    a = t.default.useRef(0),
    s = t.default.useCallback(
      (r) => {
        let t = !1,
          n = [],
          a = () => {
            t || (r(T(Date.now())), n.push(window.setTimeout(a, S(180, 900))));
          };
        if ((a(), "Burst" === e)) {
          let e = () => {
            if (!t) {
              for (let e = 0; e < 10; e++)
                n.push(
                  window.setTimeout(
                    () => r(Array.from({ length: 30 }, () => T(Date.now()))),
                    100 * e,
                  ),
                );
              n.push(window.setTimeout(e, 6e3));
            }
          };
          n.push(window.setTimeout(e, 2500));
        }
        return () => {
          ((t = !0), n.forEach((e) => window.clearTimeout(e)));
        };
      },
      [e],
    );
  return (0, r.jsx)(y, {
    title: "Relay logs",
    defaultValue: n,
    subscribe: s,
    height: 360,
    loadEarlier:
      "History" === e
        ? async (e) =>
            (await new Promise((e) => setTimeout(e, 700)), ++a.current > 4)
              ? []
              : C(40, new Date(e.at).getTime())
        : void 0,
  });
}
export default (function ({ tab: e = "Live" }) {
  return (0, r.jsx)("div", {
    style: (0, j.demoAppearance)(),
    className: "w-full max-w-[760px] text-foreground",
    children: (0, r.jsx)(R, { tab: e }, e),
  });
});
