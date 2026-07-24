"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/live-line-chart";
("use strict");
var t = dependency0;
var a = dependency1;
function u(props) {
  return dependency1.createElement(dependency4.LiveLineChart, props);
}
function d(e) {
  e.burst <= 0 && 0.035 > e.rand() && (e.burst = 6 + Math.floor(5 * e.rand()));
  let t = e.burst > 0 ? 1340 : 980;
  return (
    (e.burst -= 1),
    (e.value += (t - e.value) * 0.28 + (e.rand() - 0.5) * 90),
    Math.max(0, Math.round(e.value))
  );
}
function c() {
  let e,
    t = {
      rand:
        ((e = 11),
        () => (e = (1664525 * e + 0x3c6ef35f) % 0x100000000) / 0x100000000),
      value: 1e3,
      burst: 0,
    },
    a = Array.from({ length: 62 }, (e, a) => ({ t: 1e3 * a, value: d(t) }));
  return { walk: t, points: a };
}
export default (function () {
  let [e] = a.default.useState(c),
    [r, n] = a.default.useState(e.points);
  return (
    a.default.useEffect(() => {
      let t = window.setInterval(() => {
        n((t) => {
          let a = t[t.length - 1];
          return [...t.slice(-90), { t: a.t + 1e3, value: d(e.walk) }];
        });
      }, 1e3);
      return () => window.clearInterval(t);
    }, [e]),
    (0, t.jsx)("div", {
      className: "w-full max-w-[520px]",
      children: (0, t.jsx)(u, {
        data: r,
        label: "Relay API · requests",
        unit: "req/s",
        threshold: { value: 1200, label: "Rate limit" },
        locales: "en-US",
      }),
    })
  );
});
