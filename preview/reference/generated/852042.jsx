"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/sparkline";
("use strict");
var t = dependency0;
function n(props) {
  return dependency1.createElement(dependency2.Sparkline, props);
}
export default (function ({ tab: e = "Table cell" }) {
  return (0, t.jsxs)("div", {
    className: "flex w-full max-w-lg flex-col items-center justify-center p-4",
    children: [
      "Table cell" === e &&
        (0, t.jsxs)("div", {
          className:
            "w-full overflow-hidden rounded-2xl border border-border bg-card text-card-foreground",
          children: [
            (0, t.jsxs)("div", {
              className: "border-b border-border px-4 py-3",
              children: [
                (0, t.jsx)("p", {
                  className: "text-[13.5px] font-medium text-foreground",
                  children: "Top customers",
                }),
                (0, t.jsx)("p", {
                  className: "text-[12px] text-muted-foreground",
                  children: "30-day revenue expansion",
                }),
              ],
            }),
            (0, t.jsxs)("table", {
              className: "w-full border-collapse text-left text-[13px]",
              children: [
                (0, t.jsx)("thead", {
                  children: (0, t.jsxs)("tr", {
                    className:
                      "border-b border-border/60 text-[11.5px] font-medium text-muted-foreground",
                    children: [
                      (0, t.jsx)("th", {
                        className: "py-2.5 px-4 font-normal",
                        children: "Customer",
                      }),
                      (0, t.jsx)("th", {
                        className: "py-2.5 px-4 font-normal",
                        children: "30d Trend",
                      }),
                      (0, t.jsx)("th", {
                        className: "py-2.5 px-4 text-right font-normal",
                        children: "MRR",
                      }),
                    ],
                  }),
                }),
                (0, t.jsx)("tbody", {
                  className: "divide-y divide-border/40",
                  children: [
                    {
                      name: "Fernhill Labs",
                      mrr: 14200,
                      history: [8200, 9100, 10400, 11200, 12800, 13400, 14200],
                      status: "Active",
                    },
                    {
                      name: "Relay Sync",
                      mrr: 8900,
                      history: [10200, 9800, 9400, 9100, 8900, 9200, 8900],
                      status: "Active",
                    },
                    {
                      name: "Northwind AI",
                      mrr: 24500,
                      history: [16e3, 17500, 19e3, 21400, 22800, 24500],
                      status: "Enterprise",
                    },
                  ].map((e) =>
                    (0, t.jsxs)(
                      "tr",
                      {
                        className: "transition-colors hover:bg-muted/40",
                        children: [
                          (0, t.jsx)("td", {
                            className: "py-3 px-4 font-medium text-foreground",
                            children: e.name,
                          }),
                          (0, t.jsx)("td", {
                            className: "py-3 px-4 w-36",
                            children: (0, t.jsx)(n, {
                              data: e.history,
                              height: 24,
                              variant: "area",
                              prefix: "$",
                            }),
                          }),
                          (0, t.jsxs)("td", {
                            className:
                              "py-3 px-4 text-right font-mono text-foreground tabular-nums",
                            children: ["$", e.mrr.toLocaleString()],
                          }),
                        ],
                      },
                      e.name,
                    ),
                  ),
                }),
              ],
            }),
          ],
        }),
      "Stat strip" === e &&
        (0, t.jsxs)("div", {
          className: "grid w-full grid-cols-1 gap-3 sm:grid-cols-2",
          children: [
            (0, t.jsxs)("div", {
              className:
                "rounded-2xl border border-border bg-card p-4 text-card-foreground",
              children: [
                (0, t.jsxs)("div", {
                  className: "flex items-center justify-between",
                  children: [
                    (0, t.jsx)("span", {
                      className: "text-[12.5px] text-muted-foreground",
                      children: "Active builders",
                    }),
                    (0, t.jsx)("span", {
                      className:
                        "rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400",
                      children: "+38.7%",
                    }),
                  ],
                }),
                (0, t.jsxs)("div", {
                  className: "mt-2 flex items-baseline justify-between",
                  children: [
                    (0, t.jsx)("span", {
                      className:
                        "font-mono text-[22px] font-semibold tracking-tight text-foreground",
                      children: "1,720",
                    }),
                    (0, t.jsx)("div", {
                      className: "w-24",
                      children: (0, t.jsx)(n, {
                        data: [
                          { value: 1240, date: "Oct 1" },
                          { value: 1320, date: "Oct 4" },
                          { value: 1290, date: "Oct 8" },
                          { value: 1450, date: "Oct 11" },
                          { value: 1580, date: "Oct 14" },
                          { value: 1720, date: "Oct 17" },
                        ],
                        height: 26,
                        color: "auto",
                        variant: "area",
                      }),
                    }),
                  ],
                }),
              ],
            }),
            (0, t.jsxs)("div", {
              className:
                "rounded-2xl border border-border bg-card p-4 text-card-foreground",
              children: [
                (0, t.jsxs)("div", {
                  className: "flex items-center justify-between",
                  children: [
                    (0, t.jsx)("span", {
                      className: "text-[12.5px] text-muted-foreground",
                      children: "Net churn rate",
                    }),
                    (0, t.jsx)("span", {
                      className:
                        "rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400",
                      children: "-1.4%",
                    }),
                  ],
                }),
                (0, t.jsxs)("div", {
                  className: "mt-2 flex items-baseline justify-between",
                  children: [
                    (0, t.jsx)("span", {
                      className:
                        "font-mono text-[22px] font-semibold tracking-tight text-foreground",
                      children: "1.8%",
                    }),
                    (0, t.jsx)("div", {
                      className: "w-24",
                      children: (0, t.jsx)(n, {
                        data: [
                          { value: 3.2, date: "Oct 1" },
                          { value: 2.8, date: "Oct 4" },
                          { value: 2.9, date: "Oct 8" },
                          { value: 2.4, date: "Oct 11" },
                          { value: 2.1, date: "Oct 14" },
                          { value: 1.8, date: "Oct 17" },
                        ],
                        height: 26,
                        color: "primary",
                        variant: "area",
                        suffix: "%",
                      }),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      "Bar variant" === e &&
        (0, t.jsxs)("div", {
          className:
            "w-full rounded-2xl border border-border bg-card p-5 text-card-foreground",
          children: [
            (0, t.jsxs)("div", {
              className:
                "flex items-center justify-between border-b border-border pb-3",
              children: [
                (0, t.jsxs)("div", {
                  children: [
                    (0, t.jsx)("p", {
                      className: "text-[13.5px] font-medium text-foreground",
                      children: "API throughput",
                    }),
                    (0, t.jsx)("p", {
                      className: "text-[12px] text-muted-foreground",
                      children: "Requests per second",
                    }),
                  ],
                }),
                (0, t.jsx)("span", {
                  className:
                    "font-mono text-[13px] font-medium text-foreground",
                  children: "88 req/s",
                }),
              ],
            }),
            (0, t.jsxs)("div", {
              className: "mt-6 flex flex-col items-center",
              children: [
                (0, t.jsx)(n, {
                  data: [
                    { value: 42, date: "12:00" },
                    { value: 68, date: "13:00" },
                    { value: 85, date: "14:00" },
                    { value: 54, date: "15:00" },
                    { value: 72, date: "16:00" },
                    { value: 91, date: "17:00" },
                    { value: 64, date: "18:00" },
                    { value: 48, date: "19:00" },
                    { value: 78, date: "20:00" },
                    { value: 88, date: "21:00" },
                  ],
                  height: 48,
                  variant: "bars",
                  color: "primary",
                  suffix: " req/s",
                }),
                (0, t.jsx)("p", {
                  className: "mt-3 text-[11.5px] text-muted-foreground",
                  children:
                    "Hover columns to inspect exact timestamp and requests.",
                }),
              ],
            }),
          ],
        }),
    ],
  });
});
