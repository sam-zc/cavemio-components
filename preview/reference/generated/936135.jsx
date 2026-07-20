"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/inline-edit";
import * as dependency5 from "./25369.jsx";
("use strict");
var r = dependency0;
var t = dependency1;
function h(props) {
  return dependency1.createElement(dependency4.InlineEdit, props);
}
var w = dependency5;
let b = (e) => new Promise((r) => setTimeout(r, e));
let j = (e) =>
  e
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
let y = ["Billing", "Mobile app", "Docs"];
let k = [
  { id: "v1", name: "Open bugs", count: 12 },
  { id: "v2", name: "My week", count: 5 },
  { id: "v3", name: "Waiting on design", count: 3 },
];
function N({ tab: e }) {
  let n = "Renamed elsewhere" === e,
    [a, s] = t.default.useState("Relay web"),
    [i, o] = t.default.useState("relay-web"),
    [l, c] = t.default.useState("Checkout times out on slow networks"),
    [d, u] = t.default.useState(k),
    [m, f] = t.default.useState(null),
    p = t.default.useRef(+("Server says no" === e));
  return (
    t.default.useEffect(() => {
      if (!n) return;
      let e = [
        setTimeout(() => {
          (c("Checkout times out on 3G connections"),
            f("Maya renamed this just now"));
        }, 1600),
        setTimeout(() => {
          (c("Checkout times out on 3G and hotel Wi-Fi"),
            f("Leo renamed this just now"));
        }, 6200),
      ];
      return () => e.forEach(clearTimeout);
    }, [n]),
    (0, r.jsxs)("div", {
      className: "rounded-[22px] border border-border bg-background p-4 sm:p-5",
      children: [
        (0, r.jsxs)("div", {
          className:
            "flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[12.5px] text-muted-foreground",
          children: [
            (0, r.jsxs)("p", {
              className: "flex min-w-0 items-baseline gap-1.5",
              children: [
                (0, r.jsx)("span", {
                  className: "shrink-0",
                  children: "Fernhill",
                }),
                (0, r.jsx)("span", {
                  "aria-hidden": "true",
                  className: "shrink-0 opacity-60",
                  children: "/",
                }),
                (0, r.jsx)(h, {
                  label: "Project name",
                  value: a,
                  onValueChange: s,
                  maxLength: 32,
                  className: "min-w-0 font-medium text-foreground",
                  onSave: async (e) => {
                    if (
                      (await b(700),
                      y.some((r) => r.toLowerCase() === e.toLowerCase()))
                    )
                      throw Error(
                        `Fernhill already has a project called “${e}”.`,
                      );
                    if (p.current > 0)
                      throw (
                        p.current--,
                        Error(
                          "You need admin rights to rename projects. Ask Maya.",
                        )
                      );
                  },
                }),
              ],
            }),
            (0, r.jsxs)("p", {
              className: "flex min-w-0 items-baseline font-mono text-[12px]",
              children: [
                (0, r.jsx)("span", {
                  className: "shrink-0",
                  children: "relay.app/",
                }),
                (0, r.jsx)(h, {
                  label: "Project address",
                  value: i,
                  onValueChange: o,
                  maxLength: 24,
                  className: "min-w-0 text-foreground",
                  validate: (e) =>
                    j(e).length < 3
                      ? "Use at least three letters or numbers."
                      : null,
                  onSave: async (e) => (await b(650), j(e)),
                }),
              ],
            }),
          ],
        }),
        (0, r.jsx)(h, {
          wrap: !0,
          label: "Issue title",
          value: l,
          onValueChange: (e) => {
            (c(e), f(null));
          },
          maxLength: 80,
          className:
            "mt-3 text-[20px] font-semibold leading-[1.3] tracking-[-0.02em] sm:text-[22px]",
          validate: (e) =>
            e.length < 8
              ? "A title needs a few more words to be found later."
              : null,
          onSave: async () => {
            await b(800);
          },
        }),
        (0, r.jsxs)("p", {
          className: "mt-2 text-[12px] text-muted-foreground",
          children: [
            "REL-482 · Opened by Leo ·",
            " ",
            (0, r.jsx)(
              "span",
              {
                className:
                  "inline-block animate-[ui-fade-in_420ms_cubic-bezier(0.16,1,0.3,1)_both]",
                children: m ?? "Click any name to rename it",
              },
              m ?? "hint",
            ),
          ],
        }),
        (0, r.jsxs)("div", {
          className: "mt-4 border-t border-border pt-3",
          children: [
            (0, r.jsx)("p", {
              className: "text-[11.5px] font-medium text-muted-foreground",
              children: "Saved views",
            }),
            (0, r.jsx)("ul", {
              className: "mt-1.5",
              children: d.map((e) =>
                (0, r.jsxs)(
                  "li",
                  {
                    className:
                      "flex h-9 items-center gap-2.5 border-b border-border text-[13.5px] last:border-b-0",
                    children: [
                      (0, r.jsx)("svg", {
                        viewBox: "0 0 16 16",
                        fill: "none",
                        "aria-hidden": "true",
                        className: "size-3.5 shrink-0 text-muted-foreground",
                        children: (0, r.jsx)("path", {
                          d: "M2.5 4h11M4.5 8h7M6.5 12h3",
                          stroke: "currentColor",
                          strokeWidth: "1.5",
                          strokeLinecap: "round",
                        }),
                      }),
                      (0, r.jsx)(h, {
                        label: `Rename view ${e.name}`,
                        value: e.name,
                        onValueChange: (r) =>
                          u((t) =>
                            t.map((t) =>
                              t.id === e.id ? { ...t, name: r } : t,
                            ),
                          ),
                        maxLength: 28,
                        className: "min-w-0",
                        validate: (r) =>
                          d.some(
                            (t) =>
                              t.id !== e.id &&
                              t.name.toLowerCase() === r.toLowerCase(),
                          )
                            ? `You already have a view called “${r}”.`
                            : null,
                        onSave: async () => {
                          await b(550);
                        },
                      }),
                      (0, r.jsx)("span", {
                        className:
                          "ml-auto shrink-0 text-[12px] tabular-nums text-muted-foreground",
                        children: e.count,
                      }),
                    ],
                  },
                  e.id,
                ),
              ),
            }),
          ],
        }),
      ],
    })
  );
}
export default (function ({ tab: e = "Rename" }) {
  return (0, r.jsx)("div", {
    style: (0, w.demoAppearance)(),
    className: "w-full max-w-[480px] text-foreground",
    children: (0, r.jsx)(N, { tab: e }, e),
  });
});
