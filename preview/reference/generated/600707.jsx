"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency3 from "../../../registry/components/toast-stack";
("use strict");
var t = dependency0;
let i = [];
let s = 0;
let o = new Set();
let a = () => o.forEach((e) => e());
function l(e, t = {}) {
  let r = t.id ?? `t${++s}`,
    n = i.find((e) => e.id === r),
    o = t.type ?? "default",
    c = {
      ...n,
      ...t,
      id: r,
      title: e,
      type: o,
      duration: t.duration ?? n?.duration ?? 4e3,
      version: (n?.version ?? 0) + 1,
      dismissed: !1,
    };
  return ((i = n ? i.map((e) => (e.id === r ? c : e)) : [c, ...i]), a(), r);
}
function c(e, t) {
  return l(e, t);
}
((c.success = (e, t) => l(e, { ...t, type: "success" })),
  (c.error = (e, t) => l(e, { ...t, type: "error" })),
  (c.info = (e, t) => l(e, { ...t, type: "info" })),
  (c.loading = (e, t) => l(e, { ...t, type: "loading" })),
  (c.promise = (e, t) => {
    let r = l(t.loading, { type: "loading", description: t.description });
    return (
      e.then(
        (e) =>
          l("function" == typeof t.success ? t.success(e) : t.success, {
            id: r,
            type: "success",
          }),
        (e) =>
          l("function" == typeof t.error ? t.error(e) : t.error, {
            id: r,
            type: "error",
          }),
      ),
      e
    );
  }),
  (c.dismiss = (e) => {
    ((i = i.map((t) =>
      void 0 === e || t.id === e ? { ...t, dismissed: !0 } : t,
    )),
      a());
  }));
function b(props) {
  return dependency1.createElement(dependency3.Toaster, props);
}
let j =
  "cursor-pointer inline-flex h-9 items-center rounded-full px-4 text-[13px] font-medium text-foreground shadow-[inset_0_0_0_1px_var(--border)] transition-colors hover:bg-accent active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";
let w = (e, t = !1) => new Promise((r, n) => window.setTimeout(t ? n : r, e));
export default (function () {
  return (0, t.jsxs)("div", {
    className: "flex max-w-[460px] flex-col items-center gap-4",
    children: [
      (0, t.jsxs)("div", {
        className: "flex flex-wrap justify-center gap-2",
        children: [
          (0, t.jsx)("button", {
            type: "button",
            className: `cursor-pointer ${j} bg-primary text-primary-foreground shadow-none hover:bg-primary/90`,
            onClick: () =>
              c.promise(w(1600), {
                loading: "Saving changes",
                success: "Changes saved",
                error: "Couldn’t save",
                description: "Opening hours for Harbour Road",
              }),
            children: "Save changes",
          }),
          (0, t.jsx)("button", {
            type: "button",
            className: j,
            onClick: () =>
              l("Order #2041 archived", {
                description: "It’s out of the queue but kept in history.",
                action: {
                  label: "Undo",
                  onClick: () => c.success("Order restored"),
                },
              }),
            children: "Archive order",
          }),
          (0, t.jsx)("button", {
            type: "button",
            className: j,
            onClick: () =>
              c.promise(w(1200, !0), {
                loading: "Sending the invoice",
                success: "Invoice sent",
                error: "The invoice didn’t send",
              }),
            children: "Send invoice",
          }),
          (0, t.jsx)("button", {
            type: "button",
            className: j,
            onClick: () => c.info("Ana joined the Harbour Road shop"),
            children: "Teammate joined",
          }),
        ],
      }),
      (0, t.jsx)("p", {
        className: "text-center text-[12.5px] text-muted-foreground",
        children:
          "Toasts stack in the corner. Hover them to fan out, swipe one away, or press Alt+T to reach them.",
      }),
      (0, t.jsx)(b, { position: "bottom-right" }),
    ],
  });
});
