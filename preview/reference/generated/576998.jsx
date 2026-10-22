"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../icon-factory";
import * as dependency11 from "../../../registry/components/wallet";
("use strict");
var t = dependency0;
var r = dependency1;
var a = dependency2;
let n = (0, a.default)("Coffee", [
  ["path", { d: "M10 2v2", key: "7u0qdc" }],
  ["path", { d: "M14 2v2", key: "6buw04" }],
  [
    "path",
    {
      d: "M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",
      key: "pwadti",
    },
  ],
  ["path", { d: "M6 2v2", key: "colzsn" }],
]);
let s = (0, a.default)("IceCreamCone", [
  ["path", { d: "m7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11", key: "1v6356" }],
  ["path", { d: "M17 7A5 5 0 0 0 7 7", key: "151p3v" }],
  ["path", { d: "M17 7a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4", key: "1sdaij" }],
]);
let i = (0, a.default)("Wind", [
  ["path", { d: "M12.8 19.6A2 2 0 1 0 14 16H2", key: "148xed" }],
  ["path", { d: "M17.5 8a2.5 2.5 0 1 1 2 4H2", key: "1u4tom" }],
  ["path", { d: "M9.8 4.4A2 2 0 1 1 11 8H2", key: "75valh" }],
]);
function _(props) {
  return dependency1.createElement(dependency11.Wallet, props);
}
let z = [
  { id: "iris", name: "Iris Okafor" },
  { id: "theo", name: "Theo Brandt" },
  { id: "sana", name: "Sana Rafi" },
  { id: "jonah", name: "Jonah Wells" },
  { id: "lena", name: "Lena Varga" },
];
let A = (e) => new Promise((t) => setTimeout(t, e));
let D = (e) => Math.round(100 * e) / 100;
let O = 0;
let F = () => `t${++O}`;
function q() {
  let e = Date.now();
  return [
    {
      id: "a",
      title: "Kept Ice Cream",
      date: e - 252e4,
      amount: -14.5,
      icon: (0, t.jsx)(s, { strokeWidth: 1.75 }),
    },
    { id: "b", title: "From Iris", date: e - 18e6, amount: 120 },
    {
      id: "c",
      title: "Northwind Studio",
      date: e - 936e5,
      amount: -60,
      icon: (0, t.jsx)(i, { strokeWidth: 1.75 }),
    },
    {
      id: "d",
      title: "Fernhill Coffee",
      date: e - 108e6,
      amount: -4.8,
      icon: (0, t.jsx)(n, { strokeWidth: 1.75 }),
    },
  ];
}
export default (function ({ tab: e = "Wallet" }) {
  let [a, n] = (0, r.useState)(2840.65),
    [s, i] = (0, r.useState)(q),
    o = (0, r.useRef)([]);
  ((0, r.useEffect)(() => {
    let e = o.current;
    return () => e.forEach((e) => window.clearTimeout(e));
  }, []),
    (0, r.useEffect)(() => {
      if ("Money in" !== e) return;
      let t = window.setTimeout(() => {
        (n((e) => D(e + 250)),
          i((e) => [
            { id: F(), title: "From Theo", date: Date.now(), amount: 250 },
            ...e,
          ]));
      }, 1400);
      return () => window.clearTimeout(t);
    }, [e]));
  let l = async ({ contact: t, amount: r }) => {
      if ((await A(1100), "Declined" === e))
        throw Error("Your bank declined this payment.");
      (n((e) => D(e - r)),
        i((e) => [
          {
            id: F(),
            title: `To ${t.name.split(" ")[0]}`,
            date: Date.now(),
            amount: -r,
          },
          ...e,
        ]));
    },
    d = async ({ contact: e, amount: t }) => {
      await A(900);
      let r = F();
      (i((a) => [
        {
          id: r,
          title: `From ${e.name.split(" ")[0]}`,
          date: Date.now(),
          amount: t,
          status: "pending",
        },
        ...a,
      ]),
        o.current.push(
          window.setTimeout(() => {
            (n((e) => D(e + t)),
              i((e) =>
                e.map((e) =>
                  e.id === r ? { ...e, status: "paid", date: Date.now() } : e,
                ),
              ));
          }, 4200),
        ));
    };
  return (0, t.jsx)(_, {
    name: "Kai Morgan",
    label: "Kept Debit",
    last4: "4021",
    balance: a,
    contacts: z,
    transactions: s,
    onSend: l,
    onRequest: d,
    paymentLink: "pay.kept.co/kai",
    locale: "en-US",
  });
});
