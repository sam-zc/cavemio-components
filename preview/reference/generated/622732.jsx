"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency7 from "../../../registry/components/drop-zone-membrane";
import * as dependency8 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
var a = dependency2;
var n = dependency2;
var i = dependency2;
function w(props) {
  return dependency1.createElement(dependency7.DropZoneMembrane, props);
}
var A = dependency8;
let E = [
  { name: "storefront.jpg", type: "image/jpeg", size: 24e5 },
  { name: "autumn-menu.pdf", type: "application/pdf", size: 86e4 },
  { name: "cone-render.png", type: "image/png", size: 41e5 },
  { name: "launch-cut.mov", type: "video/quicktime", size: 48e6 },
];
let C = [
  { name: "portrait.jpg", type: "image/jpeg", size: 12e5 },
  { name: "portrait-alt.png", type: "image/png", size: 29e5 },
  { name: "team-photo.jpg", type: "image/jpeg", size: 14e6 },
];
function R({ samples: e, zone: r }) {
  return (0, t.jsxs)("div", {
    className: "mt-3 flex flex-wrap items-center gap-1.5 px-1",
    children: [
      (0, t.jsx)("span", {
        className: "mr-1 text-[11.5px] text-muted-foreground",
        children: "Drag in:",
      }),
      e.map((e) => (0, t.jsx)(T, { sample: e, zone: r }, e.name)),
    ],
  });
}
function T({ sample: e, zone: s }) {
  let l,
    o = r.default.useRef(null),
    c = r.default.useRef(null),
    d = (l = e.type).startsWith("image/")
      ? n.FileImage
      : "application/pdf" === l
        ? i.FileText
        : a.File,
    u = () => {
      let t = new File([""], e.name, { type: e.type });
      return (Object.defineProperty(t, "size", { value: e.size }), t);
    },
    m = (e) => {
      let t = o.current;
      if (t) {
        if (e) {
          ((t.style.transition = "none"),
            (t.style.transform = ""),
            (t.style.opacity = "0"),
            t.animate(
              [
                { opacity: 0, transform: "scale(0.9)" },
                { opacity: 1, transform: "none" },
              ],
              {
                duration: 320,
                delay: 900,
                easing: "cubic-bezier(0.16,1,0.3,1)",
                fill: "backwards",
              },
            ),
            requestAnimationFrame(() => {
              t.style.opacity = "";
            }));
          return;
        }
        ((t.style.transition =
          "transform 420ms cubic-bezier(0.34,1.36,0.64,1)"),
          (t.style.transform = ""));
      }
    };
  return (0, t.jsxs)("button", {
    ref: o,
    type: "button",
    onPointerDown: (e) => {
      0 === e.button &&
        (e.currentTarget.setPointerCapture(e.pointerId),
        (c.current = {
          x: e.clientX,
          y: e.clientY,
          id: e.pointerId,
          held: !1,
          moved: !1,
        }),
        (e.currentTarget.style.transition = "none"));
    },
    onPointerMove: (t) => {
      let r = c.current;
      if (!r || r.id !== t.pointerId) return;
      let a = t.clientX - r.x,
        n = t.clientY - r.y;
      (!r.moved && 4 > Math.hypot(a, n)) ||
        ((r.moved = !0),
        (t.currentTarget.style.transform = `translate3d(${a}px,${n}px,0) rotate(${Math.max(-6, Math.min(6, a / 40))}deg)`),
        (r.held = s.current?.drag(t.clientX, t.clientY, [e.type]) ?? !1));
    },
    onPointerUp: (e) => {
      let t = c.current;
      if (((c.current = null), !t || !t.moved))
        return (s.current?.drop([u()]), m(!0));
      t.held
        ? (s.current?.drop([u()], { x: e.clientX, y: e.clientY }), m(!0))
        : (s.current?.cancel(), m(!1));
    },
    onPointerCancel: () => {
      ((c.current = null), s.current?.cancel(), m(!1));
    },
    className:
      "relative z-20 flex h-7 cursor-grab touch-none select-none items-center gap-1.5 rounded-full bg-background px-2.5 text-[12px] shadow-[inset_0_0_0_1px_var(--border)] will-change-transform active:cursor-grabbing",
    children: [
      (0, t.jsx)(d, {
        className: "size-3.5 text-muted-foreground",
        strokeWidth: 1.75,
        "aria-hidden": "true",
      }),
      e.name,
    ],
  });
}
export default (function ({ tab: e = "Upload" }) {
  let a = "Single file" === e,
    n = r.default.useRef(null),
    i = r.default.useRef(new Set());
  return (0, t.jsxs)("div", {
    style: (0, A.demoAppearance)(),
    className: "w-full max-w-[460px] text-foreground",
    children: [
      (0, t.jsxs)("div", {
        className:
          "rounded-[22px] border border-border bg-background p-4 @container sm:p-5",
        children: [
          (0, t.jsxs)("div", {
            className: "flex items-baseline justify-between gap-3",
            children: [
              (0, t.jsx)("p", {
                className: "text-[14px] font-medium tracking-[-0.01em]",
                children: a ? "Profile photo" : "Brand assets",
              }),
              (0, t.jsx)("p", {
                className: "text-[11.5px] text-muted-foreground",
                children: a ? "Kept · Settings" : "Kept · Autumn launch",
              }),
            ],
          }),
          (0, t.jsx)(
            w,
            {
              ref: n,
              className: "mt-4",
              accept: a ? "image/*" : "image/*,.pdf",
              maxSize: a ? 5e6 : 1e7,
              multiple: !a,
              maxFiles: a ? 1 : 6,
              title: a ? "Drop a photo" : "Drop files here",
              hint: a
                ? "JPG or PNG, up to 5 MB"
                : "images or PDFs, up to 10 MB",
              onUpload: (t, { progress: r, signal: a }) =>
                new Promise((n, s) => {
                  let l,
                    o = 0,
                    c =
                      "Fails once" === e &&
                      !i.current.has(t.name) &&
                      "application/pdf" !== t.type,
                    d = () =>
                      (r((o = Math.min(1, o + 0.06 + 0.16 * Math.random()))),
                      c && o > 0.5)
                        ? (i.current.add(t.name), s(Error("Connection lost")))
                        : o >= 1
                          ? n()
                          : void (l = setTimeout(d, 140 + 220 * Math.random()));
                  ((l = setTimeout(d, 380)),
                    a.addEventListener("abort", () => clearTimeout(l)));
                }),
            },
            e,
          ),
        ],
      }),
      (0, t.jsx)(R, { samples: a ? C : E, zone: n }),
    ],
  });
});
