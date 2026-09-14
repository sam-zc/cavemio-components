"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency3 from "../icon-factory";
import * as dependency5 from "../../../registry/components/imported-ui-interaction-motion";
import * as dependency8 from "../../../registry/components/text-morph";
import * as dependency11 from "../../../registry/components/workflow-canvas";
import * as dependency12 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency2;
var i = dependency2;
var s = dependency3;
let a = (0, s.default)("ListTree", [
  ["path", { d: "M21 12h-8", key: "1bmf0i" }],
  ["path", { d: "M21 6H8", key: "1pqkrb" }],
  ["path", { d: "M21 18h-8", key: "1tm79t" }],
  ["path", { d: "M3 6v4c0 1.1.9 2 2 2h3", key: "1ywdgy" }],
  ["path", { d: "M3 10v6c0 1.1.9 2 2 2h3", key: "2wc746" }],
]);
var o = dependency2;
var l = dependency2;
var d = dependency2;
var c = dependency2;
var b = dependency5;
var w = dependency8;
function R(props) {
  return dependency1.createElement(dependency11.WorkflowCanvas, props);
}
var S = dependency12;
let z = [
  {
    id: "brief",
    title: "Receive brief",
    subtitle: "Inbox trigger",
    icon: (0, t.jsx)(i.Inbox, { className: "size-3" }),
    x: 14,
    y: 131,
  },
  {
    id: "research",
    title: "Find references",
    subtitle: "3 sources",
    icon: (0, t.jsx)(d.Search, { className: "size-3" }),
    x: 242,
    y: 38,
  },
  {
    id: "outline",
    title: "Shape the outline",
    subtitle: "4 sections",
    icon: (0, t.jsx)(a, { className: "size-3" }),
    x: 242,
    y: 224,
  },
  {
    id: "draft",
    title: "Create proposal",
    subtitle: "First draft",
    icon: (0, t.jsx)(n.FileText, { className: "size-3" }),
    x: 470,
    y: 131,
  },
];
let I = [
  { id: "brief-research", from: "brief", to: "research" },
  { id: "brief-outline", from: "brief", to: "outline" },
  { id: "research-draft", from: "research", to: "draft" },
  { id: "outline-draft", from: "outline", to: "draft" },
];
let T = {
  brief: "A brand campaign brief, received from the studio inbox.",
  research:
    "Find visual references for a warm, architectural direction. Collect three sources with context.",
  outline:
    "Organise the brief into direction, deliverables, schedule and budget.",
  draft:
    "Combine the references and outline into a proposal ready for a first review.",
};
export default (function ({ tab: e }) {
  let n = (0, b.useInteractionReducedMotion)(),
    [i, s] = r.default.useState({}),
    [a, d] = r.default.useState(!1),
    [u, f] = r.default.useState(
      "A small workflow for a thoughtful first draft.",
    ),
    m = r.default.useRef([]),
    h = () => {
      (m.current.forEach(clearTimeout), (m.current = []));
    };
  r.default.useEffect(() => h, []);
  let x = "Needs retry" === e,
    p = z.map((e) => ({
      ...e,
      status: i[e.id] ?? "idle",
      detail: (0, t.jsxs)("div", {
        children: [
          (0, t.jsx)("p", { children: T[e.id] }),
          "error" === i[e.id] &&
            (0, t.jsx)("p", {
              className: "mt-2 text-destructive",
              children:
                "The reference source timed out. Retry to continue from this step.",
            }),
        ],
      }),
    })),
    y = Object.values(i).includes("error");
  return (0, t.jsxs)("div", {
    style: (0, S.demoAppearance)(),
    className: "w-full max-w-[680px] rounded-2xl bg-background",
    children: [
      (0, t.jsxs)("div", {
        className: "mb-4 flex items-center justify-between gap-3",
        children: [
          (0, t.jsxs)("div", {
            children: [
              (0, t.jsx)("p", {
                className: "text-[13px] font-medium text-foreground",
                children: "Brief to first draft",
              }),
              (0, t.jsx)("p", {
                className: "mt-1 text-[10px] text-muted-foreground",
                children: "Studio workflow / 01",
              }),
            ],
          }),
          (0, t.jsxs)("button", {
            type: "button",
            onClick: () =>
              a
                ? void (h(),
                  d(!1),
                  f("Run cancelled. Completed steps are kept."),
                  s((e) =>
                    Object.fromEntries(
                      z.map((t) => [
                        t.id,
                        "complete" === e[t.id] ? "complete" : "idle",
                      ]),
                    ),
                  ))
                : ((e = !1) => {
                    (h(),
                      d(!0),
                      f(
                        e
                          ? "Retrying the research, then continuing the proposal."
                          : "The brief is moving through the studio.",
                      ),
                      s(
                        e
                          ? {
                              brief: "complete",
                              research: "running",
                              outline: "complete",
                              draft: "queued",
                            }
                          : {
                              brief: "running",
                              research: "queued",
                              outline: "queued",
                              draft: "queued",
                            },
                      ));
                    let t = (e, t) => m.current.push(setTimeout(t, e));
                    (e ||
                      t(700, () =>
                        s({
                          brief: "complete",
                          research: "running",
                          outline: "running",
                          draft: "queued",
                        }),
                      ),
                      t(e ? 1300 : 2300, () => {
                        x && !e
                          ? (s({
                              brief: "complete",
                              research: "error",
                              outline: "complete",
                              draft: "queued",
                            }),
                            d(!1),
                            f(
                              "Research needs another try. Your completed work is kept.",
                            ))
                          : s({
                              brief: "complete",
                              research: "complete",
                              outline: "complete",
                              draft: "running",
                            });
                      }),
                      (!x || e) &&
                        t(e ? 2600 : 3700, () => {
                          (s({
                            brief: "complete",
                            research: "complete",
                            outline: "complete",
                            draft: "complete",
                          }),
                            d(!1),
                            f("The first draft is ready for review."));
                        }));
                  })(y),
            className: `cursor-pointer inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-primary bg-primary px-3.5 text-[11px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 ${b.INTERACTION_FOCUS}`,
            children: [
              (0, t.jsxs)("span", {
                "aria-hidden": "true",
                className: "relative size-3",
                children: [
                  (0, t.jsx)(c.Square, {
                    className: "absolute inset-0 size-3 fill-current",
                    style: (0, b.interactionIcon)(a, n),
                  }),
                  (0, t.jsx)(l.RotateCcw, {
                    className: "absolute inset-0 size-3",
                    style: (0, b.interactionIcon)(!a && y, n),
                  }),
                  (0, t.jsx)(o.Play, {
                    className: "absolute inset-0 size-3 fill-current",
                    style: (0, b.interactionIcon)(!a && !y, n),
                  }),
                ],
              }),
              (0, t.jsx)(w.TextMorph, {
                children: a ? "Cancel run" : y ? "Retry step" : "Run workflow",
              }),
            ],
          }),
        ],
      }),
      (0, t.jsx)(R, {
        nodes: p,
        edges: I,
        label: "Proposal workflow",
        width: 650,
        height: 340,
      }),
      (0, t.jsx)("p", {
        role: "status",
        className: "mt-3 text-[12px] text-muted-foreground",
        children: (0, t.jsx)(w.TextMorph, { animateWidth: !1, children: u }),
      }),
      (0, t.jsx)("p", {
        className: "mt-2 text-[10px] text-muted-foreground",
        children: "Drag nodes or the canvas. Select a node to inspect it.",
      }),
    ],
  });
});
