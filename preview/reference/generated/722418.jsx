"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency3 from "../icon-factory";
import * as dependency6 from "../../../registry/components/filter-bar";
import * as dependency7 from "../../../registry/components/data-table";
import * as dependency8 from "./25369.jsx";
("use strict");
var t = dependency0;
var a = dependency1;
var i = dependency2;
var r = dependency3;
let n = (0, r.default)("CalendarClock", [
  [
    "path",
    {
      d: "M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5",
      key: "1osxxc",
    },
  ],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M3 10h5", key: "r794hk" }],
  ["path", { d: "M17.5 17.5 16 16.3V14", key: "akvzfd" }],
  ["circle", { cx: "16", cy: "16", r: "6", key: "qoo3c4" }],
]);
var l = dependency2;
let s = (0, r.default)("CircleCheck", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }],
]);
let o = (0, r.default)("CircleDashed", [
  ["path", { d: "M10.1 2.182a10 10 0 0 1 3.8 0", key: "5ilxe3" }],
  ["path", { d: "M13.9 21.818a10 10 0 0 1-3.8 0", key: "11zvb9" }],
  ["path", { d: "M17.609 3.721a10 10 0 0 1 2.69 2.7", key: "1iw5b2" }],
  ["path", { d: "M2.182 13.9a10 10 0 0 1 0-3.8", key: "c0bmvh" }],
  ["path", { d: "M20.279 17.609a10 10 0 0 1-2.7 2.69", key: "1ruxm7" }],
  ["path", { d: "M21.818 10.1a10 10 0 0 1 0 3.8", key: "qkgqxc" }],
  ["path", { d: "M3.721 6.391a10 10 0 0 1 2.7-2.69", key: "1mcia2" }],
  ["path", { d: "M6.391 20.279a10 10 0 0 1-2.69-2.7", key: "1fvljs" }],
]);
let d = (0, r.default)("CircleDot", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
]);
var u = dependency2;
var c = dependency2;
var p = dependency2;
let h = (0, r.default)("OctagonAlert", [
  ["path", { d: "M12 16h.01", key: "1drbdi" }],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  [
    "path",
    {
      d: "M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z",
      key: "1fd625",
    },
  ],
]);
let m = (0, r.default)("SignalHigh", [
  ["path", { d: "M2 20h.01", key: "4haj6o" }],
  ["path", { d: "M7 20v-4", key: "j294jx" }],
  ["path", { d: "M12 20v-8", key: "i3yub9" }],
  ["path", { d: "M17 20V8", key: "1tkaf5" }],
]);
let f = (0, r.default)("SignalLow", [
  ["path", { d: "M2 20h.01", key: "4haj6o" }],
  ["path", { d: "M7 20v-4", key: "j294jx" }],
]);
let x = (0, r.default)("SignalMedium", [
  ["path", { d: "M2 20h.01", key: "4haj6o" }],
  ["path", { d: "M7 20v-4", key: "j294jx" }],
  ["path", { d: "M12 20v-8", key: "i3yub9" }],
]);
var y = dependency2;
var g = dependency2;
let b = (0, r.default)("User", [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }],
]);
var v = dependency2;
function W(e, t, a, i = Date.now()) {
  let r = t.filter((e) => !("values" in e) || e.values.length);
  if (!r.length) return e;
  let n = new Map(a.map((e) => [e.id, e]));
  return e.filter((e) =>
    r.every((t) => {
      let a = n.get(t.field);
      if (!a) return !0;
      let r = a.get ? a.get(e) : e[a.id];
      switch (t.op) {
        case "is":
        case "is not": {
          let e = (
            Array.isArray(r) ? r.map(String) : null == r ? [] : [String(r)]
          ).some((e) => t.values.includes(e));
          return "is" === t.op ? e : !e;
        }
        case "contains":
        case "does not contain": {
          let e = String(r ?? "")
            .toLowerCase()
            .includes(t.text.toLowerCase());
          return "contains" === t.op ? e : !e;
        }
        case "at least":
          return "number" == typeof r && r >= t.number;
        case "at most":
          return "number" == typeof r && r <= t.number;
        case "is exactly":
          return "number" == typeof r && r === t.number;
        case "within":
        case "older than": {
          let e =
            r instanceof Date
              ? r.getTime()
              : "string" == typeof r || "number" == typeof r
                ? new Date(r).getTime()
                : NaN;
          if (Number.isNaN(e)) return !1;
          return "within" === t.op
            ? e >= i - 864e5 * t.days
            : e < i - 864e5 * t.days;
        }
      }
    }),
  );
}
function X(props) {
  return dependency1.createElement(dependency6.FilterBar, props);
}
var G = dependency7;
var Y = dependency8;
let Z = Date.now();
let J = (e) => new Date(Z - 864e5 * e);
let Q = (e) => {
  let t = Math.round((Z - e.getTime()) / 864e5);
  return 0 === t
    ? "Today"
    : 1 === t
      ? "Yesterday"
      : t < 30
        ? `${t}d ago`
        : `${Math.round(t / 30)}mo ago`;
};
let ee = [
  { value: "backlog", label: "Backlog", icon: (0, t.jsx)(o, {}) },
  { value: "todo", label: "Todo", icon: (0, t.jsx)(l.Circle, {}) },
  { value: "doing", label: "In progress", icon: (0, t.jsx)(d, {}) },
  { value: "done", label: "Done", icon: (0, t.jsx)(s, {}) },
];
let et = [
  { value: "urgent", label: "Urgent", icon: (0, t.jsx)(h, {}) },
  { value: "high", label: "High", icon: (0, t.jsx)(m, {}) },
  { value: "medium", label: "Medium", icon: (0, t.jsx)(x, {}) },
  { value: "low", label: "Low", icon: (0, t.jsx)(f, {}) },
  { value: "none", label: "No priority", icon: (0, t.jsx)(p.Minus, {}) },
];
let ea = [
  { value: "maya", label: "Maya Chen" },
  { value: "leo", label: "Leo Park" },
  { value: "ana", label: "Ana Ruiz" },
  { value: "sam", label: "Sam Ortiz" },
];
let ei = [
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
  { value: "improvement", label: "Improvement" },
];
let er = [
  {
    id: "status",
    label: "Status",
    type: "option",
    icon: (0, t.jsx)(d, {}),
    options: ee,
  },
  {
    id: "priority",
    label: "Priority",
    type: "option",
    icon: (0, t.jsx)(m, {}),
    options: et,
  },
  {
    id: "assignee",
    label: "Assignee",
    type: "option",
    icon: (0, t.jsx)(b, {}),
    options: ea,
  },
  {
    id: "label",
    label: "Label",
    type: "option",
    icon: (0, t.jsx)(y.Tag, {}),
    options: ei,
  },
  { id: "title", label: "Title", type: "text", icon: (0, t.jsx)(g.Type, {}) },
  { id: "updated", label: "Updated", type: "date", icon: (0, t.jsx)(n, {}) },
];
let en = [
  [
    "REL-512",
    "Checkout times out on slow networks",
    "doing",
    "urgent",
    "maya",
    "bug",
    0,
  ],
  ["REL-511", "Export invoices as CSV", "todo", "high", "leo", "feature", 1],
  ["REL-509", "Seat changes don’t prorate", "doing", "high", "ana", "bug", 2],
  [
    "REL-507",
    "Retry failed webhooks",
    "todo",
    "medium",
    "maya",
    "improvement",
    3,
  ],
  [
    "REL-506",
    "Dark mode for the billing page",
    "backlog",
    "low",
    "sam",
    "feature",
    12,
  ],
  [
    "REL-503",
    "Invite teammates by email",
    "done",
    "high",
    "maya",
    "feature",
    4,
  ],
  [
    "REL-501",
    "Search ignores archived projects",
    "todo",
    "medium",
    "leo",
    "bug",
    6,
  ],
  [
    "REL-498",
    "Slack alerts for failed payments",
    "backlog",
    "none",
    "ana",
    "feature",
    40,
  ],
  [
    "REL-496",
    "Two-factor codes expire too fast",
    "doing",
    "high",
    "sam",
    "bug",
    1,
  ],
  [
    "REL-494",
    "Faster dashboard load",
    "todo",
    "medium",
    "ana",
    "improvement",
    9,
  ],
  ["REL-490", "Audit log for admins", "backlog", "low", "leo", "feature", 64],
  ["REL-487", "Typo on the pricing page", "done", "low", "sam", "bug", 18],
  ["REL-485", "Bulk-edit customer tags", "todo", "high", "maya", "feature", 5],
  [
    "REL-481",
    "PDF receipts cut off long names",
    "backlog",
    "medium",
    "leo",
    "bug",
    33,
  ],
  [
    "REL-478",
    "Remember the last workspace",
    "done",
    "none",
    "ana",
    "improvement",
    21,
  ],
  [
    "REL-474",
    "Rate limit the public API",
    "doing",
    "urgent",
    "leo",
    "improvement",
    2,
  ],
].map(([e, t, a, i, r, n, l]) => ({
  id: e,
  key: e,
  title: t,
  status: a,
  priority: i,
  assignee: r,
  label: n,
  updated: J(l),
}));
let el = (e, t) => e.find((e) => e.value === t);
function es({ name: e }) {
  return (0, t.jsx)("span", {
    className:
      "flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[9.5px] font-medium text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)]",
    "aria-hidden": "true",
    children: e
      .split(" ")
      .map((e) => e[0])
      .join(""),
  });
}
function eo({ icon: e, children: a }) {
  return (0, t.jsxs)("span", {
    className: "inline-flex min-w-0 items-center gap-1.5",
    children: [
      e &&
        (0, t.jsx)("span", {
          className: "flex shrink-0 text-muted-foreground [&_svg]:size-3.5",
          "aria-hidden": "true",
          children: e,
        }),
      (0, t.jsx)("span", { className: "truncate", children: a }),
    ],
  });
}
let ed = [
  {
    key: "title",
    header: "Issue",
    width: "minmax(0,2.4fr)",
    sortable: !0,
    searchable: !0,
    card: "title",
    cell: (e) =>
      (0, t.jsxs)("span", {
        className: "flex min-w-0 items-baseline gap-2",
        children: [
          (0, t.jsx)("span", {
            className: "shrink-0 font-mono text-[11.5px] text-muted-foreground",
            children: e.key,
          }),
          (0, t.jsx)("span", { className: "truncate", children: e.title }),
        ],
      }),
  },
  {
    key: "status",
    header: "Status",
    width: "minmax(0,1fr)",
    card: "subtitle",
    value: (e) => el(ee, e.status)?.label,
    cell: (e) =>
      (0, t.jsx)(eo, {
        icon: el(ee, e.status)?.icon,
        children: el(ee, e.status)?.label,
      }),
  },
  {
    key: "priority",
    header: "Priority",
    width: "minmax(0,0.9fr)",
    card: "hidden",
    value: (e) => et.findIndex((t) => t.value === e.priority),
    sortable: !0,
    cell: (e) =>
      (0, t.jsx)(eo, {
        icon: el(et, e.priority)?.icon,
        children: el(et, e.priority)?.label,
      }),
  },
  {
    key: "assignee",
    header: "Assignee",
    width: "minmax(0,1fr)",
    card: "hidden",
    value: (e) => el(ea, e.assignee)?.label,
    cell: (e) =>
      (0, t.jsxs)("span", {
        className: "inline-flex min-w-0 items-center gap-1.5",
        children: [
          (0, t.jsx)(es, { name: el(ea, e.assignee).label }),
          (0, t.jsx)("span", {
            className: "truncate",
            children: el(ea, e.assignee)?.label,
          }),
        ],
      }),
  },
  {
    key: "updated",
    header: "Updated",
    width: "88px",
    align: "right",
    card: "trailing",
    sortable: !0,
    value: (e) => e.updated,
    cell: (e) =>
      (0, t.jsx)("span", {
        className: "tabular-nums text-muted-foreground",
        children: Q(e.updated),
      }),
  },
];
async function eu(e) {
  await new Promise((e) => setTimeout(e, 900));
  let t = e.toLowerCase(),
    a = [],
    i = (e, i, r) => {
      let n = i
        .filter((e) => r(e).some((e) => RegExp(`\\b${e}`).test(t)))
        .map((e) => e.value);
      n.length && a.push({ field: e, op: "is", values: n });
    };
  if (
    (i(
      "priority",
      et.filter((e) => "none" !== e.value),
      (e) => [e.label.toLowerCase()],
    ),
    i("label", ei, (e) => [e.value]),
    i("assignee", ea, (e) => [e.label.split(" ")[0].toLowerCase()]),
    i("status", ee, (e) => [
      e.label.toLowerCase(),
      ...("doing" === e.value ? ["started", "open"] : []),
    ]),
    /this week|last week|7 days|recent/.test(t) &&
      a.push({ field: "updated", op: "within", days: 7 }),
    /stale|old|untouched/.test(t) &&
      a.push({ field: "updated", op: "older than", days: 30 }),
    !a.length)
  )
    throw Error("Nothing recognised");
  return a;
}
let ec = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
  { value: "business", label: "Business" },
];
let ep = [
  { value: "us", label: "United States" },
  { value: "de", label: "Germany" },
  { value: "in", label: "India" },
  { value: "gb", label: "United Kingdom" },
];
let eh = [
  {
    id: "plan",
    label: "Plan",
    type: "option",
    icon: (0, t.jsx)(u.CreditCard, {}),
    options: ec,
  },
  {
    id: "seats",
    label: "Seats",
    type: "number",
    icon: (0, t.jsx)(v.Users, {}),
    unit: ["seat", "seats"],
  },
  {
    id: "company",
    label: "Company",
    type: "text",
    icon: (0, t.jsx)(i.Building2, {}),
  },
  {
    id: "country",
    label: "Country",
    type: "option",
    icon: (0, t.jsx)(c.Globe, {}),
    options: ep,
  },
  { id: "joined", label: "Signed up", type: "date", icon: (0, t.jsx)(n, {}) },
];
let em = [
  ["Northwind Dairy", "business", 48, "us", 210],
  ["Fernhill Studio", "pro", 12, "gb", 45],
  ["Halcyon Labs", "business", 120, "us", 400],
  ["Saltbox Games", "pro", 24, "de", 20],
  ["Meadow Farms", "free", 2, "in", 5],
  ["Cobalt Energy", "business", 64, "de", 150],
  ["Vela Travel", "pro", 18, "in", 75],
  ["Arbor Robotics", "free", 3, "us", 2],
  ["Brightwater", "pro", 25, "gb", 300],
  ["Fjord Analytics", "free", 1, "de", 12],
  ["Kestrel Health", "business", 86, "us", 18],
].map(([e, t, a, i, r], n) => ({
  id: `c${n}`,
  company: e,
  plan: t,
  seats: a,
  country: i,
  joined: J(r),
}));
let ef = [
  {
    key: "company",
    header: "Company",
    width: "minmax(0,1.6fr)",
    sortable: !0,
    searchable: !0,
    card: "title",
  },
  {
    key: "plan",
    header: "Plan",
    width: "minmax(0,0.8fr)",
    card: "subtitle",
    value: (e) => el(ec, e.plan)?.label,
  },
  {
    key: "seats",
    header: "Seats",
    width: "72px",
    align: "right",
    sortable: !0,
    card: "trailing",
    cell: (e) =>
      (0, t.jsx)("span", { className: "tabular-nums", children: e.seats }),
  },
  {
    key: "country",
    header: "Country",
    width: "minmax(0,1fr)",
    card: "hidden",
    value: (e) => el(ep, e.country)?.label,
  },
  {
    key: "joined",
    header: "Signed up",
    width: "96px",
    align: "right",
    sortable: !0,
    card: "hidden",
    value: (e) => e.joined,
    cell: (e) =>
      (0, t.jsx)("span", {
        className: "tabular-nums text-muted-foreground",
        children: Q(e.joined),
      }),
  },
];
let ex = {
  Issues: "Press F or Filter. Type “hig” to jump straight to High.",
  "Describe it":
    "Type “high priority bugs” or “Maya’s work from this week”, then choose Filter by…",
  Customers:
    "Numbers and dates: Seats at least 20, Signed up in the last 30 days.",
  Editing: "Click “is” to flip it. Click a value to tick more on or off.",
};
let ey = [
  { id: "e1", field: "status", op: "is", values: ["todo", "doing"] },
  { id: "e2", field: "priority", op: "is", values: ["high"] },
];
function eg({ title: e, note: a, children: i }) {
  return (0, t.jsxs)("div", {
    style: (0, Y.demoAppearance)(),
    className: "w-full max-w-[780px] text-foreground",
    children: [
      (0, t.jsx)("p", {
        className: "mb-2.5 px-1 text-[14px] font-medium tracking-[-0.01em]",
        children: e,
      }),
      i,
      (0, t.jsx)("p", {
        className: "mt-2 px-1 text-[11.5px] text-muted-foreground",
        children: a,
      }),
    ],
  });
}
function eb({ tab: e }) {
  let [i, r] = a.default.useState("Editing" === e ? ey : []),
    n = a.default.useMemo(() => W(en, i, er, Z), [i]);
  return (0, t.jsxs)(eg, {
    title: "Relay · Issues",
    note: ex[e] ?? ex.Issues,
    children: [
      (0, t.jsx)(X, {
        fields: er,
        value: i,
        onValueChange: r,
        parse: "Describe it" === e ? eu : void 0,
        label: "Issue filters",
      }),
      (0, t.jsx)(G.DataTable, {
        className: "mt-2.5",
        label: "Issues",
        columns: ed,
        rows: n,
        noun: ["issue", "issues"],
        pageSize: 6,
        searchPlaceholder: "Search issues",
        defaultSort: { key: "updated", dir: "desc" },
      }),
    ],
  });
}
function ev() {
  let [e, i] = a.default.useState([]),
    r = a.default.useMemo(() => W(em, e, eh, Z), [e]);
  return (0, t.jsxs)(eg, {
    title: "Relay · Customers",
    note: ex.Customers,
    children: [
      (0, t.jsx)(X, {
        fields: eh,
        value: e,
        onValueChange: i,
        label: "Customer filters",
      }),
      (0, t.jsx)(G.DataTable, {
        className: "mt-2.5",
        label: "Customers",
        columns: ef,
        rows: r,
        noun: ["customer", "customers"],
        pageSize: 6,
        searchPlaceholder: "Search customers",
        defaultSort: { key: "seats", dir: "desc" },
      }),
    ],
  });
}
export default (function ({ tab: e = "Issues" }) {
  return "Customers" === e ? (0, t.jsx)(ev, {}) : (0, t.jsx)(eb, { tab: e }, e);
});
