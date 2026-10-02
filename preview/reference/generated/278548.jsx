"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/data-table";
import * as dependency3 from "../../../registry/components/number-roll";
import * as dependency4 from "../../../registry/components/text-morph";
import * as dependency5 from "./25369.jsx";
("use strict");
var t = dependency0;
var a = dependency1;
var r = dependency2;
var l = dependency3;
var s = dependency4;
var i = dependency5;
let n = { Starter: 12, Team: 24, Scale: 48 };
let o = (e) => ("Churned" === e.status ? 0 : e.seats * n[e.plan]);
let d = [
  ["Northwind Dairy", "ops@northwind.co"],
  ["Fernhill Studio", "maya@fernhill.co"],
  ["Kept Ice Cream", "ana@kept.shop"],
  ["Halcyon Labs", "billing@halcyon.dev"],
  ["Oakline Bikes", "leo@oakline.bike"],
  ["Brightwater", "finance@brightwater.io"],
  ["Juniper Health", "sam@juniper.health"],
  ["Lumen & Co", "hello@lumen.co"],
  ["Pinewood Press", "priya@pinewood.press"],
  ["Tidewater Freight", "ap@tidewater.com"],
  ["Quarry Coffee", "tom@quarry.coffee"],
  ["Atlas Robotics", "ines@atlas.ai"],
  ["Marlow Legal", "ops@marlow.law"],
  ["Saltbox Games", "jonah@saltbox.gg"],
  ["Cobalt Energy", "billing@cobalt.energy"],
  ["Orchard Schools", "it@orchard.edu"],
  ["Vela Travel", "mei@vela.travel"],
  ["Redwood Bank", "vendor@redwood.bank"],
  ["Mosaic Health", "theo@mosaic.health"],
  ["Ember Foods", "ravi@ember.food"],
  ["Granite Build", "ops@granite.build"],
  ["Willow Clinic", "admin@willow.clinic"],
  ["Harbor Insure", "ap@harbor.insure"],
  ["Polar Analytics", "dan@polar.so"],
];
let c = [
  "Starter",
  "Team",
  "Scale",
  "Team",
  "Starter",
  "Scale",
  "Team",
  "Team",
];
let u = [
  "Active",
  "Active",
  "Trial",
  "Active",
  "Past due",
  "Active",
  "Churned",
  "Active",
  "Trial",
];
function m() {
  let e = new Date();
  return d.map(([t, a], r) => ({
    id: `c${r + 1}`,
    company: t,
    email: a,
    plan: c[r % c.length],
    seats: [
      4, 12, 3, 28, 6, 40, 9, 15, 5, 22, 2, 34, 8, 11, 60, 18, 7, 45, 14, 10,
      25, 3, 19, 6,
    ][r],
    status: u[r % u.length],
    joined: new Date(e.getFullYear(), e.getMonth(), e.getDate() - (11 * r + 3)),
  }));
}
let h = {
  Active: "text-emerald-700 dark:text-emerald-400",
  Trial: "text-muted-foreground",
  "Past due": "text-amber-700 dark:text-amber-400",
  Churned: "text-red-600 dark:text-red-400",
};
function p({ status: e }) {
  return (0, t.jsxs)("span", {
    className: `inline-flex h-6 items-center gap-1.5 rounded-full px-2 text-[12px] shadow-[inset_0_0_0_1px_var(--border)] transition-colors duration-300 ${h[e]}`,
    children: [
      (0, t.jsx)("span", {
        className: "size-1.5 rounded-full bg-current",
        "aria-hidden": "true",
      }),
      (0, t.jsx)(s.TextMorph, { children: e }),
    ],
  });
}
let x = { style: "currency", currency: "USD", maximumFractionDigits: 0 };
let b = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});
let g = [
  {
    key: "company",
    header: "Customer",
    width: "minmax(0,1.7fr)",
    sortable: !0,
    searchable: !0,
    card: "title",
    value: (e) => e.company,
    cell: (e) =>
      (0, t.jsxs)("span", {
        className: "block min-w-0 leading-tight",
        children: [
          (0, t.jsx)("span", {
            className: "block truncate font-medium",
            children: e.company,
          }),
          (0, t.jsx)("span", {
            className: "block truncate text-[12px] text-muted-foreground",
            children: e.email,
          }),
        ],
      }),
  },
  {
    key: "plan",
    header: "Plan",
    width: "minmax(0,0.8fr)",
    sortable: !0,
    searchable: !0,
    card: "subtitle",
  },
  {
    key: "seats",
    header: "Seats",
    width: "76px",
    align: "right",
    sortable: !0,
    editable: !0,
    card: "subtitle",
    cell: (e) => (0, t.jsx)(l.NumberRoll, { value: e.seats }),
  },
  {
    key: "mrr",
    header: "MRR",
    width: "96px",
    align: "right",
    sortable: !0,
    card: "trailing",
    value: o,
    cell: (e) =>
      (0, t.jsx)(l.NumberRoll, { value: o(e), format: x, locales: "en-US" }),
  },
  {
    key: "status",
    header: "Status",
    width: "116px",
    sortable: !0,
    searchable: !0,
    card: "trailing",
    cell: (e) => (0, t.jsx)(p, { status: e.status }),
  },
];
let f = (e) => new Promise((t) => setTimeout(t, e));
function w({ tab: e }) {
  let [s, d] = a.default.useState(m),
    c = "Live updates" === e,
    u = "Phone cards" === e;
  a.default.useEffect(() => {
    if (!c) return;
    let e = 0,
      t = setInterval(() => {
        document.hidden ||
          (e++,
          d((t) => {
            if (e % 4 == 0) {
              let [a, r] = [
                ["Arbor Robotics", "ops@arbor.bot"],
                ["Fjord Analytics", "hi@fjord.so"],
                ["Cinder Studio", "kai@cinder.studio"],
                ["Meadow Farms", "ap@meadow.farm"],
              ][((e / 4) % 4) | 0];
              return [
                {
                  id: `new-${e}`,
                  company: a,
                  email: r,
                  plan: "Scale",
                  seats: 18 + ((7 * e) % 24),
                  status: "Trial",
                  joined: new Date(),
                },
                ...t,
              ];
            }
            let a = [...t].sort((e, t) => o(t) - o(e)).slice(1, 8),
              r = a[(3 * e) % a.length];
            return t.map((t) =>
              t.id !== r.id
                ? t
                : e % 3 == 1 && "Active" !== t.status
                  ? { ...t, status: "Active" }
                  : { ...t, seats: t.seats + 10 + ((5 * e) % 14) },
            );
          }));
      }, 2200);
    return () => clearInterval(t);
  }, [c]);
  let h = [
    {
      id: "export",
      label: "Export",
      progress: ["Exporting", "Exported"],
      run: () => f(900),
    },
    {
      id: "email",
      label: "Email",
      progress: ["Sending", "Sent"],
      run: () => f(1100),
    },
    {
      id: "delete",
      label: "Delete",
      progress: ["Deleting", "Deleted"],
      tone: "destructive",
      removes: !0,
      run: async (e) => {
        await f(400);
        let t = new Set(e.map((e) => e.id));
        d((e) => e.filter((e) => !t.has(e.id)));
      },
    },
  ];
  return (0, t.jsxs)("div", {
    style: (0, i.demoAppearance)(),
    className: `w-full text-foreground ${u ? "max-w-[360px]" : "max-w-[760px]"}`,
    children: [
      (0, t.jsxs)("div", {
        className: "mb-3 flex items-baseline justify-between gap-3 px-1",
        children: [
          (0, t.jsx)("p", {
            className: "text-[14px] font-medium tracking-[-0.01em]",
            children: "Customers",
          }),
          (0, t.jsxs)("p", {
            className: "text-[11.5px] tabular-nums text-muted-foreground",
            children: [
              (0, t.jsx)(l.NumberRoll, {
                value: s.reduce((e, t) => e + o(t), 0),
                format: x,
                locales: "en-US",
              }),
              " MRR",
            ],
          }),
        ],
      }),
      (0, t.jsx)(r.DataTable, {
        label: "Customers",
        noun: ["customer", "customers"],
        columns: g,
        rows: s,
        defaultSort:
          c || "Customers" === e ? { key: "mrr", dir: "desc" } : null,
        searchPlaceholder: "Search customers",
        selectable: !0,
        defaultSelected: "Bulk actions" === e ? ["c2", "c4", "c7"] : void 0,
        actions: h,
        pageSize: u ? 6 : 8,
        rowLabel: (e) => e.company,
        onEdit: async (e, t, a) => {
          let r = Number(a);
          if ((await f(650), !Number.isInteger(r) || r < 1 || r > 999))
            throw Error("Seats must be a whole number");
          d((t) => t.map((t) => (t.id === e.id ? { ...t, seats: r } : t)));
        },
        renderDetail: (e) =>
          (0, t.jsx)("dl", {
            className:
              "grid grid-cols-2 gap-x-6 gap-y-2 text-[12.5px] sm:grid-cols-4",
            children: [
              ["Contact", e.email],
              ["Joined", b.format(e.joined)],
              ["Price", `$${n[e.plan]} a seat`],
              [
                "Next invoice",
                "Churned" === e.status
                  ? "None"
                  : `$${o(e).toLocaleString("en")} on the 1st`,
              ],
            ].map(([e, a]) =>
              (0, t.jsxs)(
                "div",
                {
                  className: "min-w-0",
                  children: [
                    (0, t.jsx)("dt", {
                      className: "text-muted-foreground",
                      children: e,
                    }),
                    (0, t.jsx)("dd", { className: "truncate", children: a }),
                  ],
                },
                e,
              ),
            ),
          }),
      }),
      (0, t.jsx)("p", {
        className: "mt-3 px-1 text-[11.5px] text-muted-foreground",
        children: u
          ? "Narrow containers get one card per row."
          : "Click a header to sort, double-click a seat count to edit it, Shift-click to select a range.",
      }),
    ],
  });
}
export default (function ({ tab: e = "Customers" }) {
  return (0, t.jsx)(w, { tab: e }, e);
});
