"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency3 from "../../../registry/components/live-map";
import * as dependency4 from "../../../registry/components/number-roll";
("use strict");
var t = dependency0;
var r = dependency1;
function g(props) {
  return dependency1.createElement(dependency3.LiveMap, props);
}
var y = dependency4;
let b = [
  ["Lisbon, Portugal", 38.7, -9.1],
  ["Berlin, Germany", 52.5, 13.4],
  ["New York, USA", 40.7, -74],
  ["San Francisco, USA", 37.8, -122.4],
  ["Toronto, Canada", 43.7, -79.4],
  ["Mexico City, Mexico", 19.4, -99.1],
  ["São Paulo, Brazil", -23.5, -46.6],
  ["Buenos Aires, Argentina", -34.6, -58.4],
  ["Lagos, Nigeria", 6.5, 3.4],
  ["Nairobi, Kenya", -1.3, 36.8],
  ["Cape Town, South Africa", -33.9, 18.4],
  ["Cairo, Egypt", 30, 31.2],
  ["Dubai, UAE", 25.2, 55.3],
  ["Mumbai, India", 19.1, 72.9],
  ["Bengaluru, India", 12.97, 77.6],
  ["Singapore", 1.35, 103.8],
  ["Jakarta, Indonesia", -6.2, 106.8],
  ["Tokyo, Japan", 35.7, 139.7],
  ["Seoul, South Korea", 37.6, 127],
  ["Sydney, Australia", -33.9, 151.2],
  ["Auckland, New Zealand", -36.8, 174.8],
  ["London, UK", 51.5, -0.13],
  ["Paris, France", 48.9, 2.35],
  ["Stockholm, Sweden", 59.3, 18.1],
  ["Istanbul, Türkiye", 41, 29],
  ["Manila, Philippines", 14.6, 121],
  ["Bangkok, Thailand", 13.75, 100.5],
  ["Austin, USA", 30.3, -97.7],
  ["Vancouver, Canada", 49.3, -123.1],
  ["Bogotá, Colombia", 4.7, -74.1],
  ["Lima, Peru", -12, -77],
  ["Accra, Ghana", 5.6, -0.2],
];
let j = { lat: 38.7, lon: -9.1 };
let v = [18, 24, 32, 21, 46, 28, 36];
export default (function ({ tab: e = "Signups" }) {
  let a = "Orders" === e,
    [n, i] = (0, r.useState)([]),
    [o, l] = (0, r.useState)(a ? 312 : 2847);
  return (
    (0, r.useEffect)(() => {
      let e = 0,
        t = -1,
        r = () => {
          let r = Math.floor(Math.random() * b.length);
          ((r === t || (a && b[r][0].startsWith("Lisbon"))) &&
            (r = (r + 5) % b.length),
            (t = r));
          let [n, o, s] = b[r],
            c = e++;
          (i((e) => [
            ...e.slice(-12),
            a
              ? {
                  id: c,
                  lat: o,
                  lon: s,
                  label: `Order \xb7 $${v[c % v.length]}`,
                  detail: n,
                  from: j,
                }
              : { id: c, lat: o, lon: s, label: "New signup", detail: n },
          ]),
            l((e) => e + 1));
        },
        n = window.setTimeout(r, 500),
        o = window.setInterval(r, a ? 1900 : 1300);
      return () => {
        (window.clearTimeout(n), window.clearInterval(o));
      };
    }, [a]),
    (0, t.jsxs)("div", {
      className:
        "w-full max-w-[640px] rounded-[20px] border border-border bg-card p-4 sm:p-5",
      children: [
        (0, t.jsxs)("div", {
          className: "mb-3 flex items-end justify-between gap-3",
          children: [
            (0, t.jsxs)("div", {
              children: [
                (0, t.jsxs)("p", {
                  className:
                    "flex items-center gap-1.5 text-[12px] text-muted-foreground",
                  children: [
                    (0, t.jsxs)("span", {
                      className: "relative flex size-1.5",
                      children: [
                        (0, t.jsx)("span", {
                          className:
                            "absolute inset-0 rounded-full bg-emerald-500 motion-safe:animate-[ui-ping_1.6s_cubic-bezier(0,0,0.2,1)_infinite]",
                        }),
                        (0, t.jsx)("span", {
                          className:
                            "relative size-1.5 rounded-full bg-emerald-500",
                        }),
                      ],
                    }),
                    a ? "Orders today" : "Signups this week",
                  ],
                }),
                (0, t.jsx)("p", {
                  className:
                    "mt-1 text-[22px] font-semibold leading-none tracking-tight text-foreground tabular-nums sm:text-[26px]",
                  children: (0, t.jsx)(y.NumberRoll, { value: o }),
                }),
              ],
            }),
            (0, t.jsx)("p", {
              className: "text-right text-[11.5px] text-muted-foreground",
              children: a ? "Shipping from Lisbon" : "In 32 cities",
            }),
          ],
        }),
        (0, t.jsx)(g, {
          pings: n,
          markers: a ? [j] : [],
          afterglow: a ? 7e3 : 9e3,
        }),
      ],
    })
  );
});
