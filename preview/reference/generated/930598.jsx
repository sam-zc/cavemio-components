"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency6 from "../../../registry/components/code-block";
("use strict");
var t = dependency0;
var r = dependency1;
function x(props) {
  return dependency1.createElement(dependency6.CodeBlock, props);
}
let g = `// Estimate how long each order in the queue will wait.
export function withWaitTimes(orders: Order[], now = Date.now()) {
  const perScoop = 40_000; // ms, measured on a busy Saturday
  let ahead = 0;

  return orders.map((order) => {
    const scoops = order.items.reduce((n, item) => n + item.scoops, 0);
    ahead += scoops * perScoop;
    return { ...order, readyAt: new Date(now + ahead), waitMinutes: Math.ceil(ahead / 60_000) };
  });
}`;
let b = `import math
from dataclasses import dataclass


@dataclass
class Flavour:
    name: str
    litres_per_hour: float  # sold on an average Saturday
    batch_litres: float = 6.0


# Plan how many batches to churn before opening.
def churn_plan(flavours: list[Flavour], open_hours: float = 10) -> dict[str, int]:
    plan = {}
    for flavour in flavours:
        needed = flavour.litres_per_hour * open_hours * 1.15  # 15% headroom
        plan[flavour.name] = math.ceil(needed / flavour.batch_litres)
    return plan


if __name__ == "__main__":
    menu = [
        Flavour("pistachio", 4.2),
        Flavour("strawberry", 3.1),
        Flavour("salted caramel", 3.6),
        Flavour("lemon sorbet", 1.8, batch_litres=5.0),
        Flavour("dark chocolate", 2.9),
    ]
    for name, batches in churn_plan(menu).items():
        print(f"{name:>16}: {batches} batches")`;
export default (function ({ tab: e = "Streaming" }) {
  let [n, s] = (0, r.useState)("Streaming" === e ? "" : g),
    a = "Streaming" === e && n.length < g.length;
  return (
    (0, r.useEffect)(() => {
      if ("Streaming" !== e) return;
      let t = 0,
        r = 0,
        n = () => {
          ((t = Math.min(g.length, t + 3 + Math.floor(6 * Math.random()))),
            s(g.slice(0, t)),
            t < g.length && (r = window.setTimeout(n, 28)));
        };
      return ((r = window.setTimeout(n, 300)), () => window.clearTimeout(r));
    }, [e]),
    (0, t.jsx)("div", {
      className: "w-full max-w-[560px]",
      children:
        "Folded" === e
          ? (0, t.jsx)(x, {
              code: b,
              language: "python",
              filename: "churn_plan.py",
            })
          : (0, t.jsx)(x, {
              code: n,
              language: "ts",
              filename: "lib/queue.ts",
              streaming: a,
              onApply:
                "Apply" === e
                  ? () => new Promise((e) => window.setTimeout(e, 900))
                  : void 0,
            }),
    })
  );
});
