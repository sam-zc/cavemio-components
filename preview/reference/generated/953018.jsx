"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/status-button";
import * as dependency5 from "../../../registry/components/text-morph";
import * as dependency6 from "../../../registry/components/combobox";
import * as dependency7 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
var u = dependency4;
var c = dependency5;
let g = (e) => e.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");
let b = (e) => g(e).split(/\s+/).filter(Boolean);
let v = /[\s\-_/.@:#(]/;
function y(e, t) {
  let r = b(t);
  return r.length
    ? e
        .map((e, t) => ({
          option: e,
          i: t,
          score: (function (e, t) {
            let r = g(e.label),
              n = g(
                [e.description ?? "", ...(e.keywords ?? []), e.value].join(" "),
              ),
              a = 0;
            for (let e of t) {
              let t = r.indexOf(e);
              if (0 !== t)
                if (t > 0) a += v.test(r[t - 1]) ? 1 : 2;
                else {
                  if (!n.includes(e)) return null;
                  a += 3;
                }
            }
            return a;
          })(e, r),
        }))
        .filter((e) => null !== e.score)
        .sort((e, t) => e.score - t.score || e.i - t.i)
        .map((e) => e.option)
    : e;
}
function z(props) {
  return dependency1.createElement(dependency6.Combobox, props);
}
var _ = dependency7;
let D = (e, t) =>
  new Promise((r, n) => {
    let a = setTimeout(r, e);
    t?.addEventListener("abort", () => {
      (clearTimeout(a), n(new DOMException("Aborted", "AbortError")));
    });
  });
let B = [
  ["Maya Chen", "Design"],
  ["Leo Park", "Engineering"],
  ["Ana Ruiz", "Support"],
  ["Sam Okafor", "Engineering"],
  ["Priya Nair", "Product"],
  ["Tom Becker", "Engineering"],
  ["Jo Lindqvist", "Design"],
  ["Ravi Menon", "Data"],
  ["Elif Kaya", "Engineering"],
  ["Noah Brandt", "Sales"],
  ["Hana Sato", "Product"],
  ["Marcus Hale", "Support"],
  ["Ines Duarte", "Engineering"],
  ["Kofi Mensah", "Data"],
  ["Lena Vogel", "Marketing"],
  ["Omar Haddad", "Engineering"],
  ["Zoe Martin", "Design"],
  ["Yuki Tanaka", "Engineering"],
  ["Femi Adeyemi", "Sales"],
  ["Clara Moretti", "Marketing"],
].map(([e, t]) => {
  let r = `${e.split(" ")[0].toLowerCase()}@fernhill.co`;
  return {
    value: r,
    label: e,
    description: `${r} \xb7 ${t}`,
    initials: e
      .split(" ")
      .map((e) => e[0])
      .join("")
      .slice(0, 2),
    keywords: [t],
  };
});
let H = (0, t.jsxs)("svg", {
  viewBox: "0 0 16 16",
  fill: "none",
  "aria-hidden": "true",
  children: [
    (0, t.jsx)("path", {
      d: "M4 2.75h7.25v10.5H4.75A1.75 1.75 0 0 1 3 11.5v-7A1.75 1.75 0 0 1 4.75 2.75",
      stroke: "currentColor",
      strokeWidth: "1.4",
      strokeLinejoin: "round",
    }),
    (0, t.jsx)("path", {
      d: "M3 11.5c0-.97.78-1.75 1.75-1.75h6.5",
      stroke: "currentColor",
      strokeWidth: "1.4",
    }),
  ],
});
let P = [
  ["relay-web", "TypeScript", "2 days"],
  ["relay-api", "Go", "5 hours"],
  ["relay-mobile", "Swift", "1 week"],
  ["relay-docs", "MDX", "3 days"],
  ["relay-infra", "HCL", "12 days"],
  ["relay-workers", "TypeScript", "1 day"],
  ["billing-service", "Go", "4 days"],
  ["design-tokens", "JSON", "2 weeks"],
  ["marketing-site", "Astro", "6 days"],
  ["data-pipeline", "Python", "9 hours"],
  ["auth-gateway", "Rust", "3 weeks"],
  ["status-page", "TypeScript", "1 month"],
  ["archive-2023", "TypeScript", "1 year"],
  ["archive-2024", "TypeScript", "8 months"],
  ["support-bot", "Python", "2 days"],
  ["search-indexer", "Rust", "5 days"],
].map(([e, t, r]) => ({
  value: `fernhill/${e}`,
  label: e,
  description: `fernhill \xb7 ${t} \xb7 updated ${r} ago`,
  icon: H,
  keywords: [t],
}));
let F = (e) =>
  (0, t.jsx)("svg", {
    viewBox: "0 0 16 16",
    "aria-hidden": "true",
    children: (0, t.jsx)("circle", { cx: "8", cy: "8", r: "4", fill: e }),
  });
let W = [
  { value: "bug", label: "bug", group: "Type", icon: F("var(--chart-2)") },
  {
    value: "feature",
    label: "feature",
    group: "Type",
    icon: F("var(--chart-1)"),
  },
  { value: "chore", label: "chore", group: "Type", icon: F("var(--chart-5)") },
  {
    value: "regression",
    label: "regression",
    group: "Type",
    icon: F("var(--chart-2)"),
  },
  {
    value: "checkout",
    label: "checkout",
    group: "Area",
    icon: F("var(--chart-3)"),
  },
  {
    value: "billing",
    label: "billing",
    group: "Area",
    icon: F("var(--chart-3)"),
  },
  {
    value: "onboarding",
    label: "onboarding",
    group: "Area",
    icon: F("var(--chart-4)"),
  },
  {
    value: "mobile",
    label: "mobile",
    group: "Area",
    icon: F("var(--chart-4)"),
  },
  {
    value: "performance",
    label: "performance",
    group: "Area",
    icon: F("var(--chart-1)"),
  },
  {
    value: "needs-review",
    label: "needs review",
    group: "Workflow",
    icon: F("var(--chart-5)"),
  },
  {
    value: "blocked",
    label: "blocked",
    group: "Workflow",
    icon: F("var(--chart-2)"),
  },
];
let O = async (e, { signal: t }) => (
  await D(450 + 450 * Math.random(), t),
  y(B, e).slice(0, e ? 8 : 6)
);
function q() {
  let [e, n] = r.default.useState(B[1]),
    [a, o] = r.default.useState(null);
  return (0, t.jsxs)("div", {
    className: "rounded-[22px] border border-border bg-background p-4 sm:p-5",
    children: [
      (0, t.jsx)("p", {
        className: "text-[11.5px] text-muted-foreground",
        children: "REL-482 · Relay web",
      }),
      (0, t.jsx)("p", {
        className: "mt-1 text-[14px] font-medium tracking-[-0.01em]",
        children: "Checkout times out on slow networks",
      }),
      (0, t.jsxs)("dl", {
        className:
          "mt-4 divide-y divide-border border-t border-border text-[12.5px]",
        children: [
          (0, t.jsx)(K, {
            label: "Status",
            children: (0, t.jsxs)("span", {
              className: "inline-flex items-center gap-1.5 font-medium",
              children: [
                (0, t.jsx)("span", {
                  className: "size-2 rounded-full bg-amber-500",
                  "aria-hidden": "true",
                }),
                " In progress",
              ],
            }),
          }),
          (0, t.jsx)(K, {
            label: "Assignee",
            children: (0, t.jsx)(z, {
              label: "Assignee",
              variant: "pill",
              placeholder: "Assign",
              searchPlaceholder: "Search people",
              search: O,
              value: e,
              onValueChange: n,
              clearable: !0,
              align: "end",
            }),
          }),
          (0, t.jsx)(K, {
            label: "Reviewer",
            children: (0, t.jsx)(z, {
              label: "Reviewer",
              variant: "pill",
              placeholder: "Add reviewer",
              searchPlaceholder: "Search people",
              search: O,
              value: a,
              onValueChange: o,
              clearable: !0,
              align: "end",
            }),
          }),
        ],
      }),
      (0, t.jsx)("p", {
        className: "mt-3 text-[11.5px] text-muted-foreground",
        children: (0, t.jsx)(c.TextMorph, {
          children: e
            ? `${e.label.split(" ")[0]} gets a notification when you assign them.`
            : "Unassigned issues wait in triage.",
        }),
      }),
    ],
  });
}
function K({ label: e, children: r }) {
  return (0, t.jsxs)("div", {
    className: "flex min-h-11 items-center justify-between gap-3",
    children: [
      (0, t.jsx)("dt", { className: "text-muted-foreground", children: e }),
      (0, t.jsx)("dd", { className: "min-w-0", children: r }),
    ],
  });
}
function V() {
  let [e, n] = r.default.useState([P[0]]),
    [a, o] = r.default.useState("idle"),
    s = r.default.useRef(1),
    i = e.length;
  return (0, t.jsxs)("div", {
    className: "rounded-[22px] border border-border bg-background p-4 sm:p-5",
    children: [
      (0, t.jsx)("p", {
        className: "text-[14px] font-medium tracking-[-0.01em]",
        children: "Connect repositories",
      }),
      (0, t.jsx)("p", {
        className: "mt-1 text-[12.5px] text-muted-foreground",
        children:
          "Type to search GitHub (a slow network, on purpose). Tick a few, then try “archive”.",
      }),
      (0, t.jsx)(z, {
        multiple: !0,
        className: "mt-3.5",
        label: "Repositories",
        placeholder: "Search fernhill on GitHub",
        searchPlaceholder: "Search repositories",
        max: 5,
        value: e,
        onValueChange: (e) => {
          (n(e), o("idle"));
        },
        search: async (e, { signal: t }) => {
          if (
            (await D(800 + 600 * Math.random(), t),
            e.includes("arch") && s.current > 0)
          )
            throw (
              s.current--,
              Error("GitHub is rate limiting us. Try again.")
            );
          return y(P, e);
        },
      }),
      (0, t.jsxs)("div", {
        className: "mt-4 flex items-center justify-between gap-3",
        children: [
          (0, t.jsx)("p", {
            className: "text-[12px] text-muted-foreground",
            children: "Read access to code and metadata.",
          }),
          (0, t.jsx)(u.StatusButton, {
            status: a,
            labels: {
              idle:
                1 === i ? "Connect 1 repository" : `Connect ${i} repositories`,
              pending: "Connecting",
              success: "Connected",
              error: "Try again",
            },
            onClick: () => {
              i &&
                "pending" !== a &&
                (o("pending"), setTimeout(() => o("success"), 1100));
            },
            onReset: () => o("idle"),
            "aria-disabled": !i || void 0,
            className: i ? "" : "pointer-events-none opacity-50",
          }),
        ],
      }),
    ],
  });
}
function I() {
  let [e, n] = r.default.useState([W[0], W[4]]),
    [a, o] = r.default.useState([]);
  return (0, t.jsxs)("div", {
    className: "rounded-[22px] border border-border bg-background p-4 sm:p-5",
    children: [
      (0, t.jsx)("p", {
        className: "text-[11.5px] text-muted-foreground",
        children: "REL-482 · Relay web",
      }),
      (0, t.jsx)("p", {
        className: "mt-1 text-[14px] font-medium tracking-[-0.01em]",
        children: "Checkout times out on slow networks",
      }),
      (0, t.jsx)(z, {
        multiple: !0,
        className: "mt-3.5",
        label: "Labels",
        placeholder: "Add labels",
        searchPlaceholder: "Filter or create a label",
        width: 300,
        options: [...W, ...a],
        value: e,
        onValueChange: n,
        createLabel: (e) => `Create label “${e.toLowerCase()}”`,
        onCreate: async (e) => {
          await D(600);
          let t = e.toLowerCase().replace(/\s+/g, " ");
          if (t.length > 24) throw Error("Labels can be up to 24 characters.");
          let r = {
            value: t.replace(/\s/g, "-"),
            label: t,
            group: "Workflow",
            icon: F("var(--chart-4)"),
          };
          return (o((e) => [...e, r]), r);
        },
      }),
      (0, t.jsx)("p", {
        className: "mt-2.5 pl-1 text-[12px] text-muted-foreground",
        children: "Type a new name to create a label for the whole workspace.",
      }),
    ],
  });
}
export default (function ({ tab: e = "Repositories" }) {
  return (0, t.jsx)("div", {
    style: (0, _.demoAppearance)(),
    className: "w-full max-w-[440px] text-foreground",
    children:
      "Assignee" === e
        ? (0, t.jsx)(q, {})
        : "Labels" === e
          ? (0, t.jsx)(I, {})
          : (0, t.jsx)(V, {}),
  });
});
