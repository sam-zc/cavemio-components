"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency3 from "../icon-factory";
import * as dependency6 from "../../../registry/components/action-receipt";
("use strict");
var t = dependency0;
var n = dependency1;
var s = dependency2;
var i = dependency2;
var r = dependency2;
let a = (0, dependency3.default)("Megaphone", [
  ["path", { d: "m3 11 18-5v12L3 14v-3z", key: "n962bs" }],
  ["path", { d: "M11.6 16.8a3 3 0 1 1-5.8-1.6", key: "1yl0tm" }],
]);
function v(props) {
  return dependency1.createElement(dependency6.ActionReceipts, props);
}
let N = [
  {
    id: "event",
    title: "Added “Soft launch” to Saturday",
    detail: "Calendar · 9:00 am, Harbour Road",
    icon: (0, t.jsx)(s.CalendarPlus, {}),
  },
  {
    id: "email",
    title: "Emailed opening hours to 2,400 subscribers",
    detail: "Newsletter · sends in 10 minutes",
    icon: (0, t.jsx)(r.Mail, {}),
  },
  {
    id: "tasks",
    title: "Created 6 prep tasks for Ana",
    detail: "Tasks · due Friday",
    icon: (0, t.jsx)(i.ListTodo, {}),
  },
  {
    id: "post",
    title: "Scheduled the launch post",
    detail: "Instagram · Saturday, 8:30 am",
    icon: (0, t.jsx)(a, {}),
  },
];
export default (function ({ tab: e = "Live" }) {
  let [s, i] = (0, n.useState)(() =>
    "Live" === e
      ? []
      : N.map((t, n) => ({
          ...t,
          undoUntil: Date.now() + 12e3,
          ...("Failed" === e && 1 === n
            ? { status: "failed", error: "The email service didn’t respond" }
            : {}),
        })).slice(0, "Failed" === e ? 2 : 4),
  );
  (0, n.useEffect)(() => {
    if ("Live" !== e) return;
    let t = N.slice(0, 3).map((e, t) =>
      window.setTimeout(
        () => i((t) => [...t, { ...e, undoUntil: Date.now() + 12e3 }]),
        500 + 900 * t,
      ),
    );
    return () => t.forEach((e) => window.clearTimeout(e));
  }, [e]);
  let r = (e, t) => i((n) => n.map((n) => (n.id === e ? { ...n, ...t } : n)));
  return (0, t.jsxs)("div", {
    className: "w-full max-w-[460px]",
    children: [
      (0, t.jsx)("p", {
        className: "mb-2 text-[13.5px] leading-relaxed text-foreground",
        children: "Done. Here’s what I set up for Saturday:",
      }),
      (0, t.jsx)(v, {
        actions: s,
        undoWindow: 12e3,
        stackFrom: "Stacked" === e ? 3 : 4,
        onUndo: async (e) => {
          (await new Promise((e) => window.setTimeout(e, 700)),
            r(e, { status: "undone" }));
        },
        onRetry: async (e) => {
          r(e, { status: "done", error: void 0, undoUntil: Date.now() + 12e3 });
        },
      }),
    ],
  });
});
