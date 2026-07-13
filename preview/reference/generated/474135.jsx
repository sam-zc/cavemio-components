"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency4 from "../../../registry/components/imported-ui-interaction-motion";
import * as dependency8 from "../../../registry/components/drop-zone";
import * as dependency9 from "./25369.jsx";
("use strict");
var r = dependency0;
var t = dependency1;
var i = dependency2;
var l = dependency2;
var o = dependency2;
var m = dependency4;
function v(props) {
  return dependency1.createElement(dependency8.DropZone, props);
}
function j({ samples: e, zone: t }) {
  return (0, r.jsxs)("div", {
    className: "mt-3 flex flex-wrap items-center gap-1.5 px-1",
    children: [
      (0, r.jsx)("span", {
        className: "mr-1 text-[11.5px] text-muted-foreground",
        children: "Drag in:",
      }),
      e.map((e) => (0, r.jsx)(k, { sample: e, zone: t }, e.name)),
    ],
  });
}
function k({ sample: e, zone: a }) {
  let n = t.useRef(null),
    s = t.useRef(!1),
    d = e.type.startsWith("image/")
      ? l.FileImage
      : "application/pdf" === e.type
        ? o.FileText
        : i.File,
    c = () => {
      let r = new File(["Demo file"], e.name, {
        type: e.type,
        lastModified: 0,
      });
      return (Object.defineProperty(r, "size", { value: e.size }), r);
    };
  return (0, r.jsxs)("button", {
    type: "button",
    title: `Click or drag ${e.name} to try a simulated upload`,
    onClick: (e) => {
      ((s.current && 0 !== e.detail) || a.current?.drop([c()]),
        (s.current = !1));
    },
    onPointerDown: (e) => {
      0 === e.button &&
        (e.currentTarget.setPointerCapture(e.pointerId),
        (s.current = !1),
        (n.current = {
          x: e.clientX,
          y: e.clientY,
          pointer: e.pointerId,
          moved: !1,
          inside: !1,
        }));
    },
    onPointerMove: (r) => {
      let t = n.current;
      if (!t || t.pointer !== r.pointerId) return;
      let s = r.clientX - t.x,
        i = r.clientY - t.y;
      (!t.moved && 4 > Math.hypot(s, i)) ||
        ((t.moved = !0),
        (r.currentTarget.style.transform = `translate3d(${s}px,${i}px,0)`),
        (t.inside = a.current?.drag(r.clientX, r.clientY, [e.type]) ?? !1));
    },
    onPointerUp: (e) => {
      let r = n.current;
      ((n.current = null),
        (s.current = r?.moved ?? !1),
        (e.currentTarget.style.transform = ""),
        r?.moved && r.inside
          ? a.current?.drop([c()], { x: e.clientX, y: e.clientY })
          : a.current?.cancel());
    },
    onPointerCancel: (e) => {
      ((n.current = null),
        (s.current = !1),
        (e.currentTarget.style.transform = ""),
        a.current?.cancel());
    },
    className: `relative z-20 flex h-7 max-w-full cursor-grab touch-none select-none items-center gap-1.5 rounded-full bg-background px-2.5 text-[12px] shadow-[inset_0_0_0_1px_var(--border)] active:cursor-grabbing ${m.INTERACTION_FOCUS}`,
    children: [
      (0, r.jsx)(d, {
        className: "size-3.5 shrink-0 text-muted-foreground",
        strokeWidth: 1.75,
        "aria-hidden": "true",
      }),
      (0, r.jsx)("span", { className: "truncate", children: e.name }),
    ],
  });
}
var N = dependency9;
let w = [
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
export default (function ({ tab: e = "Upload" }) {
  let a = "Single file" === e,
    n = t.useRef(null),
    s = t.useRef(new Set());
  return (
    t.useEffect(() => {
      s.current.clear();
    }, [e]),
    (0, r.jsxs)("div", {
      style: (0, N.demoAppearance)(),
      className: "@container w-full max-w-[460px] text-foreground",
      children: [
        (0, r.jsxs)("div", {
          className:
            "rounded-[22px] border border-border bg-background p-4 @sm:p-5",
          children: [
            (0, r.jsxs)("div", {
              className: "flex items-baseline justify-between gap-3",
              children: [
                (0, r.jsx)("p", {
                  className:
                    "shrink-0 text-[14px] font-medium tracking-[-0.01em]",
                  children: a ? "Profile photo" : "Brand assets",
                }),
                (0, r.jsx)("p", {
                  className:
                    "min-w-0 text-right text-[11.5px] text-muted-foreground",
                  children: a ? "Kept · Settings" : "Kept · Autumn launch",
                }),
              ],
            }),
            (0, r.jsx)(
              v,
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
                onUpload: (r, { progress: t, signal: a }) =>
                  new Promise((n, i) => {
                    let l = 0,
                      o =
                        "Fails once" === e &&
                        "application/pdf" !== r.type &&
                        !s.current.has(r.name),
                      d = () => {
                        (clearInterval(u),
                          a.removeEventListener("abort", d),
                          i(
                            new DOMException("Upload cancelled", "AbortError"),
                          ));
                      },
                      c = () => {
                        (clearInterval(u), a.removeEventListener("abort", d));
                      },
                      u = setInterval(() => {
                        (t((l = Math.min(1, l + 0.125))),
                          o && l >= 0.5
                            ? (s.current.add(r.name),
                              c(),
                              i(Error("Connection lost")))
                            : l >= 1 && (c(), n()));
                      }, 240);
                    (a.addEventListener("abort", d, { once: !0 }),
                      a.aborted && d());
                  }),
              },
              e,
            ),
          ],
        }),
        (0, r.jsx)(j, { samples: a ? C : w, zone: n }),
      ],
    })
  );
});
