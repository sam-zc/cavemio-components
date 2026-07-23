"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../icon-factory";
import * as dependency5 from "../../../registry/components/live-activity";
("use strict");
var t = dependency0;
var s = dependency1;
let n = (0, dependency2.default)("ImageUp", [
  [
    "path",
    {
      d: "M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21",
      key: "9csbqa",
    },
  ],
  ["path", { d: "m14 19.5 3-3 3 3", key: "9vmjn0" }],
  ["path", { d: "M17 22v-5.5", key: "1aa6fl" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
]);
function m(props) {
  return dependency1.createElement(dependency5.LiveActivity, props);
}
let p = (e, t = {}) => ({
  id: "agent",
  label: "Planning the change",
  title: "Kept agent",
  detail: "Adding tips to the weekly export",
  steps: [
    { label: "Plan the change", done: e > 0 },
    { label: "Edit 3 files", done: e > 1 },
    { label: "Run the tests", done: e > 2 },
  ],
  ...t,
});
let f = [
  { at: 300, activity: p(0, { progress: 0.08 }) },
  { at: 1800, activity: p(1, { label: "Editing 3 files", progress: 0.34 }) },
  { at: 2700, activity: p(1, { label: "Editing 3 files", progress: 0.52 }) },
  { at: 3600, activity: p(1, { label: "Editing 3 files", progress: 0.68 }) },
  { at: 4500, activity: p(2, { label: "Running the tests", progress: 0.86 }) },
  {
    at: 6200,
    activity: p(3, {
      label: "3 files changed",
      status: "done",
      progress: 1,
      title: "Tips are in the weekly export",
      detail: "3 files changed, 12 tests passed",
      actions: [
        { label: "Dismiss", onClick: () => {} },
        { label: "View changes", onClick: () => {}, primary: !0 },
      ],
    }),
  },
  { at: 10500, activity: null },
];
let h = (e, s = {}) => ({
  id: "upload",
  label: "Uploading photos",
  icon: (0, t.jsx)(n, {}),
  title: "New flavour photos",
  detail: "Going to the menu board",
  count: { value: e, suffix: " of 4" },
  progress: e / 4,
  ...s,
});
let x = [
  { at: 300, activity: h(0, { progress: 0.05 }) },
  { at: 1200, activity: h(1) },
  { at: 2100, activity: h(2) },
  { at: 3e3, activity: h(3) },
  {
    at: 3900,
    activity: h(4, {
      label: "4 photos added",
      status: "done",
      icon: void 0,
      detail: "They’re on the menu board now",
    }),
  },
  { at: 7500, activity: null },
];
export default (function ({ tab: e = "Agent" }) {
  let [n, r] = (0, s.useState)(null),
    [i, a] = (0, s.useState)(0),
    l = "Upload" === e ? x : f;
  return (
    (0, s.useEffect)(() => {
      let e = l.map((e) =>
        window.setTimeout(() => {
          let t;
          return r(
            (t = e.activity) && {
              ...t,
              actions: t.actions?.map((e) =>
                "Dismiss" === e.label ? { ...e, onClick: () => r(null) } : e,
              ),
            },
          );
        }, e.at),
      );
      return (
        e.push(
          window.setTimeout(() => a((e) => e + 1), l[l.length - 1].at + 1500),
        ),
        () => e.forEach((e) => window.clearTimeout(e))
      );
    }, [l, i]),
    (0, t.jsxs)("div", {
      className: "flex w-full max-w-[420px] flex-col items-center",
      children: [
        (0, t.jsx)("div", {
          className:
            "flex h-[300px] w-full flex-col items-center rounded-[22px] bg-muted/50 pt-4 shadow-[inset_0_0_0_1px_var(--border)]",
          children: (0, t.jsx)(m, { activity: n }),
        }),
        (0, t.jsx)("p", {
          className: "mt-3 text-[12px] text-muted-foreground",
          children: "Tap the pill while it runs.",
        }),
      ],
    })
  );
});
