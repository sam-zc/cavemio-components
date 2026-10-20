"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency4 from "../../../registry/components/number-roll";
import * as dependency6 from "../../../registry/components/text-morph";
import * as dependency7 from "../../../registry/components/steps-form";
("use strict");
var r = dependency0;
var t = dependency1;
var n = dependency2;
var a = dependency4;
var o = dependency6;
function m(props) {
  return dependency1.createElement(dependency7.StepsForm, props);
}
let x = "cubic-bezier(0.16,1,0.3,1)";
let p = [
  { id: "starter", name: "Starter", price: 0, note: "Just you, free" },
  { id: "team", name: "Team", price: 12, note: "$12 a seat" },
  { id: "business", name: "Business", price: 24, note: "$24 a seat, SSO" },
];
let f = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
let h = (e) =>
  e
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "your-team";
let g = (e) => new Promise((r) => setTimeout(r, e));
function b({ value: e, onChange: n }) {
  let s = (0, t.useRef)([]),
    [a, i] = (0, t.useState)(null),
    o = p.findIndex((r) => r.id === e);
  return (
    (0, t.useLayoutEffect)(() => {
      let e = s.current[o];
      e && i({ y: e.offsetTop, h: e.offsetHeight });
    }, [o]),
    (0, r.jsxs)("div", {
      role: "radiogroup",
      "aria-label": "Plan",
      className: "relative flex flex-col gap-1.5",
      children: [
        a &&
          (0, r.jsx)("span", {
            "aria-hidden": "true",
            className:
              "pointer-events-none absolute inset-x-0 top-0 rounded-[12px] border border-foreground",
            style: {
              transform: `translateY(${a.y}px)`,
              height: a.h,
              transition: `transform 380ms ${x}, height 380ms ${x}`,
            },
          }),
        p.map((t, a) =>
          (0, r.jsxs)(
            "label",
            {
              ref: (e) => {
                s.current[a] = e;
              },
              className:
                "flex cursor-pointer items-center gap-3 rounded-[12px] border border-border px-3 py-2.5 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/40",
              children: [
                (0, r.jsx)("input", {
                  type: "radio",
                  name: "plan",
                  value: t.id,
                  checked: e === t.id,
                  onChange: () => n(t.id),
                  className: "sr-only",
                }),
                (0, r.jsx)("span", {
                  className:
                    "flex size-4 shrink-0 items-center justify-center rounded-full border",
                  style: {
                    borderColor:
                      e === t.id ? "var(--foreground)" : "var(--border)",
                    transition: "border-color 200ms",
                  },
                  children: (0, r.jsx)("span", {
                    className: "size-2 rounded-full bg-foreground",
                    style: {
                      transform: `scale(${+(e === t.id)})`,
                      transition:
                        "transform 260ms cubic-bezier(0.34,1.36,0.64,1)",
                    },
                  }),
                }),
                (0, r.jsx)("span", {
                  className: "flex-1 text-[13.5px] font-medium text-foreground",
                  children: t.name,
                }),
                (0, r.jsx)("span", {
                  className: "text-[12px] text-muted-foreground",
                  children: t.note,
                }),
              ],
            },
            t.id,
          ),
        ),
      ],
    })
  );
}
function v({ name: e }) {
  return (0, r.jsxs)("div", {
    className: "flex flex-col items-center py-2 text-center",
    children: [
      (0, r.jsxs)("svg", {
        width: "40",
        height: "40",
        viewBox: "0 0 40 40",
        fill: "none",
        "aria-hidden": "true",
        children: [
          (0, r.jsx)("circle", {
            cx: "20",
            cy: "20",
            r: "19",
            stroke: "var(--border)",
          }),
          (0, r.jsx)("path", {
            d: "M12.5 20.5l5 5 10-11",
            stroke: "var(--foreground)",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            pathLength: 1,
            strokeDasharray: "1",
            className:
              "motion-safe:animate-[ui-draw_520ms_cubic-bezier(0.16,1,0.3,1)_120ms_both]",
          }),
        ],
      }),
      (0, r.jsxs)("p", {
        className:
          "mt-3 text-[18px] font-semibold tracking-tight text-foreground",
        children: [e.trim() || "Your workspace", " is ready"],
      }),
      (0, r.jsxs)("p", {
        className: "mt-1 text-[13px] text-muted-foreground",
        children: ["workspace.example/", h(e)],
      }),
      (0, r.jsx)("button", {
        type: "button",
        className:
          "cursor-pointer mt-4 h-9 rounded-full bg-primary px-4 text-[13px] font-medium text-primary-foreground",
        children: "Open workspace",
      }),
    ],
  });
}
export default (function () {
  let [e, s] = (0, t.useState)(""),
    [i, l] = (0, t.useState)("team"),
    [d, c] = (0, t.useState)(["ana@kept.coffee"]),
    [u, x] = (0, t.useState)(""),
    j = p.find((e) => e.id === i),
    y = "starter" === i ? 1 : d.length + 1,
    w = () => {
      let e = u.trim().replace(/,$/, "");
      return e
        ? f.test(e)
          ? (d.includes(e) || c((r) => [...r, e]), x(""), null)
          : "That doesn’t look like an email address."
        : null;
    },
    N = [
      {
        id: "name",
        label: "Workspace",
        title: "Name your workspace",
        description: "It’s the name your team sees. You can change it later.",
        content: (0, r.jsxs)("div", {
          children: [
            (0, r.jsx)("label", {
              htmlFor: "ws-name",
              className: "sr-only",
              children: "Workspace name",
            }),
            (0, r.jsx)("input", {
              id: "ws-name",
              value: e,
              onChange: (e) => s(e.target.value),
              placeholder: "Kept Coffee",
              autoComplete: "organization",
              className:
                "h-10 w-full rounded-[10px] border border-border bg-background px-3 text-[14px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/40",
            }),
            (0, r.jsxs)("p", {
              className: "mt-2 text-[12px] text-muted-foreground",
              children: [
                "workspace.example/",
                (0, r.jsx)(o.TextMorph, {
                  className: "text-foreground",
                  children: h(e),
                }),
              ],
            }),
          ],
        }),
        validate: async () =>
          e.trim().length < 2
            ? "Give it a name, two letters or more."
            : (await g(650), "cavemio" === h(e))
              ? "workspace.example/cavemio is taken. Try another name."
              : void 0,
      },
      {
        id: "plan",
        label: "Plan",
        title: "Pick a plan",
        content: (0, r.jsx)(b, { value: i, onChange: l }),
      },
      {
        id: "team",
        label: "Team",
        title: "Invite your team",
        description:
          "Press Enter after each address. You can skip this for now.",
        content: (0, r.jsxs)("div", {
          children: [
            (0, r.jsxs)("div", {
              className:
                "flex min-h-10 flex-wrap items-center gap-1.5 rounded-[10px] border border-border bg-background p-1.5 focus-within:border-foreground/40",
              children: [
                d.map((e) =>
                  (0, r.jsxs)(
                    "span",
                    {
                      ref: (e) => {
                        e &&
                          !e.dataset.in &&
                          ((e.dataset.in = "1"),
                          e.animate(
                            [
                              { transform: "scale(0.7)", opacity: 0 },
                              { transform: "none", opacity: 1 },
                            ],
                            {
                              duration: 260,
                              easing: "cubic-bezier(0.34,1.36,0.64,1)",
                            },
                          ));
                      },
                      className:
                        "inline-flex h-7 items-center gap-1 rounded-full border border-border bg-card pl-2.5 pr-1 text-[12.5px] text-foreground",
                      children: [
                        e,
                        (0, r.jsx)("button", {
                          type: "button",
                          "aria-label": `Remove ${e}`,
                          onClick: () => c((r) => r.filter((r) => r !== e)),
                          className:
                            "cursor-pointer flex size-5 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground",
                          children: (0, r.jsx)(n.X, { className: "size-3" }),
                        }),
                      ],
                    },
                    e,
                  ),
                ),
                (0, r.jsx)("input", {
                  "aria-label": "Add an email address",
                  value: u,
                  onChange: (e) => x(e.target.value),
                  onKeyDown: (e) => {
                    (("Enter" === e.key || "," === e.key) &&
                      u.trim() &&
                      (e.preventDefault(), w()),
                      "Backspace" === e.key &&
                        !u &&
                        d.length &&
                        c((e) => e.slice(0, -1)));
                  },
                  placeholder: d.length ? "Add another" : "name@company.com",
                  className:
                    "h-7 min-w-[120px] flex-1 bg-transparent px-1.5 text-[13px] text-foreground outline-none placeholder:text-muted-foreground",
                }),
              ],
            }),
            (0, r.jsxs)("p", {
              className: "mt-2 text-[12px] tabular-nums text-muted-foreground",
              children: [
                (0, r.jsx)(a.NumberRoll, { value: y }),
                " ",
                (0, r.jsx)(o.TextMorph, {
                  children: 1 === y ? "seat" : "seats",
                }),
                " · $",
                (0, r.jsx)(a.NumberRoll, { value: y * j.price }),
                " a month",
              ],
            }),
          ],
        }),
        validate: () => w(),
      },
      {
        id: "review",
        label: "Review",
        title: "Check and create",
        content: (0, r.jsxs)("dl", {
          className:
            "divide-y divide-border rounded-[12px] border border-border text-[13px]",
          children: [
            [
              ["Workspace", e.trim()],
              ["Address", `workspace.example/${h(e)}`],
              ["Plan", j.name],
            ].map(([e, t]) =>
              (0, r.jsxs)(
                "div",
                {
                  className: "flex justify-between gap-3 px-3 py-2.5",
                  children: [
                    (0, r.jsx)("dt", {
                      className: "text-muted-foreground",
                      children: e,
                    }),
                    (0, r.jsx)("dd", {
                      className:
                        "truncate text-right font-medium text-foreground",
                      children: t,
                    }),
                  ],
                },
                e,
              ),
            ),
            (0, r.jsxs)("div", {
              className: "flex justify-between gap-3 px-3 py-2.5",
              children: [
                (0, r.jsx)("dt", {
                  className: "text-muted-foreground",
                  children: "Monthly",
                }),
                (0, r.jsxs)("dd", {
                  className: "font-medium tabular-nums text-foreground",
                  children: [
                    "$",
                    (0, r.jsx)(a.NumberRoll, { value: y * j.price }),
                    " ",
                    (0, r.jsxs)("span", {
                      className: "font-normal text-muted-foreground",
                      children: ["for ", y],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      },
    ];
  return (0, r.jsxs)("div", {
    className: "flex h-[500px] w-full max-w-[400px] flex-col sm:h-[470px]",
    children: [
      (0, r.jsx)(m, {
        steps: N,
        onSubmit: () => g(1300),
        submitLabels: {
          idle: "Create workspace",
          pending: "Creating",
          success: "Created",
        },
        done: (0, r.jsx)(v, { name: e }),
      }),
      (0, r.jsx)("p", {
        className: "mt-3 text-center text-[12px] text-muted-foreground",
        children: "Try “cavemio” as the name.",
      }),
    ],
  });
});
