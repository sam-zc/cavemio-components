"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency5 from "../../../registry/components/status-bars";
import * as dependency6 from "./25369.jsx";
("use strict");
var t = dependency0;
var a = dependency1;
function $(props) {
  return dependency1.createElement(dependency5.StatusBars, props);
}
var k = dependency6;
let S = (e) =>
  `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, "0")}-${String(e.getDate()).padStart(2, "0")}`;
let D = [
  {
    id: "inc_api",
    title: "API returned errors for some requests",
    impact: "major",
    stage: "resolved",
    services: ["API"],
    updates: [
      {
        id: "a3",
        at: Date.now() - 10368e5 + 282e4,
        stage: "resolved",
        message:
          "Error rates are back to normal. A bad config push to one region caused it; we have added a check that would have stopped it.",
      },
      {
        id: "a2",
        at: Date.now() - 10368e5 + 12e5,
        stage: "identified",
        message: "We found the cause and are rolling back the change.",
      },
      {
        id: "a1",
        at: Date.now() - 10368e5,
        stage: "investigating",
        message:
          "Some API requests are failing with 502. We are looking into it.",
      },
    ],
  },
];
let M = [
  {
    stage: "investigating",
    message: "Webhook deliveries are arriving late. We are looking into it.",
    service: "degraded",
  },
  {
    stage: "identified",
    message:
      "A stuck worker is holding part of the queue. We are restarting it.",
    service: "degraded",
  },
  {
    stage: "monitoring",
    message: "The backlog is draining. New deliveries are on time.",
    service: "operational",
  },
  {
    stage: "resolved",
    message: "All delayed deliveries have been sent. Sorry for the wait.",
    service: "operational",
  },
];
function T({ tab: e }) {
  let [r, n] = a.default.useState(() => {
      let t = [
        [
          "api",
          "API",
          3,
          [
            [12, "major", 47, "API returned errors for some requests"],
            [41, "degraded", 95, "Slow responses from the search endpoint"],
          ],
        ],
        [
          "dashboard",
          "Dashboard",
          11,
          [[26, "degraded", 30, "Charts loaded slowly"]],
        ],
        [
          "webhooks",
          "Webhooks",
          19,
          [
            [5, "degraded", 62, "Deliveries delayed by up to 4 minutes"],
            [58, "maintenance", 30, "Queue migration"],
          ],
        ],
        ["jobs", "Background jobs", 27, []],
      ].map(([e, t, a, r]) => {
        let n,
          s =
            ((n = new Date()),
            Array.from({ length: 90 }, (e, t) => {
              let s = new Date(n);
              s.setDate(n.getDate() - (89 - t));
              let i = r.find(([e]) => e === 89 - t);
              return i
                ? { date: S(s), status: i[1], minutes: i[2], incidents: [i[3]] }
                : {
                    date: S(s),
                    status: (t + a) % 37 == 0 ? "degraded" : "operational",
                    minutes: (t + a) % 37 == 0 ? 14 : void 0,
                    incidents:
                      (t + a) % 37 == 0
                        ? ["Elevated latency in one region"]
                        : void 0,
                  };
            }));
        return {
          id: e,
          name: t,
          status: "operational",
          days: s,
          uptime:
            100 -
            (s.reduce(
              (e, t) =>
                e +
                ("major" === t.status
                  ? (t.minutes ?? 0)
                  : (t.minutes ?? 0) / 3),
              0,
            ) /
              (1440 * s.length)) *
              100,
        };
      });
      return "Outage" === e
        ? t.map((e) =>
            "api" === e.id
              ? {
                  ...e,
                  status: "major",
                  days: e.days.map((e, t) =>
                    89 === t
                      ? {
                          ...e,
                          status: "major",
                          minutes: 18,
                          incidents: ["API is down"],
                        }
                      : e,
                  ),
                }
              : e,
          )
        : t;
    }),
    [s, i] = a.default.useState(() =>
      "Outage" === e
        ? [
            {
              id: "inc_down",
              title: "API is down",
              impact: "major",
              stage: "investigating",
              services: ["API"],
              updates: [
                {
                  id: "d1",
                  at: Date.now() - 36e4,
                  stage: "investigating",
                  message:
                    "Requests to the API are failing. Every engineer on call is on it.",
                },
              ],
            },
            ...D,
          ]
        : D,
    ),
    [o, d] = a.default.useState(() => Date.now() - 6e4);
  return (
    a.default.useEffect(() => {
      if ("Incident" !== e) return;
      let t = 0,
        a = () => {
          let e = M[t];
          (n((a) =>
            a.map((a) =>
              "webhooks" === a.id
                ? {
                    ...a,
                    status: e.service,
                    days: a.days.map((e, a) =>
                      89 === a
                        ? {
                            ...e,
                            status: "degraded",
                            minutes: 9 + 6 * t,
                            incidents: ["Webhook deliveries delayed"],
                          }
                        : e,
                    ),
                  }
                : a,
            ),
          ),
            i((a) => {
              let r = a.find((e) => "inc_live" === e.id),
                n = {
                  id: `u${t}`,
                  at: Date.now(),
                  stage: e.stage,
                  message: e.message,
                };
              return [
                r
                  ? { ...r, stage: e.stage, updates: [n, ...r.updates] }
                  : {
                      id: "inc_live",
                      title: "Webhook deliveries delayed",
                      impact: "minor",
                      stage: e.stage,
                      services: ["Webhooks"],
                      updates: [n],
                    },
                ...a.filter((e) => "inc_live" !== e.id),
              ];
            }),
            d(Date.now()),
            ++t < M.length && (r = window.setTimeout(a, 4200)));
        },
        r = window.setTimeout(a, 900);
      return () => window.clearTimeout(r);
    }, [e]),
    (0, t.jsx)($, {
      title: "Relay status",
      services: r,
      incidents: s,
      updatedAt: o,
    })
  );
}
export default (function ({ tab: e = "Operational" }) {
  return (0, t.jsx)("div", {
    style: (0, k.demoAppearance)(),
    className: "w-full max-w-[680px] text-foreground",
    children: (0, t.jsx)(T, { tab: e }, e),
  });
});
