"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency5 from "../../../registry/components/command-output";
("use strict");
var t = dependency0;
var r = dependency1;
function y(props) {
  return dependency1.createElement(dependency5.CommandOutput, props);
}
let N = [
  "> kept@1.4.0 test",
  "> vitest run",
  "",
  " RUN  v3.2.4 /app",
  "",
  " ✓ src/menu/flavours.test.ts (12 tests) 41ms",
  " ✓ src/menu/prices.test.ts (8 tests) 18ms",
  " ✓ src/orders/queue.test.ts (15 tests) 96ms",
  " ✓ src/orders/receipt.test.ts (6 tests) 22ms",
  " ✓ src/stock/churn-plan.test.ts (9 tests) 64ms",
  "",
  " Test Files  5 passed (5)",
  "      Tests  50 passed (50)",
  "   Duration  1.84s",
];
let k = [
  "> kept@1.4.0 build",
  "> next build",
  "",
  "   ▲ Next.js 15.5.0",
  "   Creating an optimized production build ...",
  " ✓ Compiled successfully in 9.1s",
  "   Linting and checking validity of types ...",
  "Failed to compile.",
  "",
  "./src/orders/queue.ts:42:18",
  "Type error: Property 'eta' does not exist on type 'Order'.",
  "",
  "  40 |   return orders.map((order) => ({",
  "  41 |     ...order,",
  "> 42 |     wait: order.eta - now,",
  "     |                  ^",
  "  43 |   }));",
  "Next.js build worker exited with code: 1",
];
export default (function ({ tab: e = "Passing" }) {
  let s = "Failing" === e,
    n = s ? k : N,
    [i, o] = (0, r.useState)([]),
    [l, a] = (0, r.useState)("running"),
    [u] = (0, r.useState)(() => Date.now()),
    [d, c] = (0, r.useState)(),
    m = (0, r.useRef)(void 0);
  return (
    (0, r.useEffect)(() => {
      let e = 0,
        t = () => {
          if (e >= n.length) {
            (a(s ? "error" : "success"), c(Date.now()));
            return;
          }
          let r = n[e++];
          (o((e) => [...e, r]),
            (m.current = window.setTimeout(
              t,
              "" === r ? 120 : 160 + 260 * Math.random(),
            )));
        };
      return (
        (m.current = window.setTimeout(t, 400)),
        () => window.clearTimeout(m.current)
      );
    }, [s, n]),
    (0, t.jsx)("div", {
      className: "w-full max-w-[520px]",
      children: (0, t.jsx)(y, {
        command: s ? "pnpm build" : "pnpm test",
        status: l,
        lines: i,
        exitCode: +!!s,
        startedAt: u,
        endedAt: d,
        onStop: () => {
          (window.clearTimeout(m.current),
            o((e) => [...e, "^C"]),
            a("cancelled"),
            c(Date.now()));
        },
      }),
    })
  );
});
