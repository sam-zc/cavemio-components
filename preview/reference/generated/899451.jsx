"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "./913144.jsx";
import * as dependency4 from "../../../registry/components/number-roll";
import * as dependency7 from "../../../registry/components/avatar-cropper";
import * as dependency8 from "../../../registry/components/text-morph";
import * as dependency9 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency2;
var n = n;
var l = dependency4;
function z(props) {
  return dependency1.createElement(dependency7.AvatarCropper, props);
}
var j = dependency8;
var k = dependency9;
let $ = "/demos/cavemio/ui-assets/avatar-cropper";
let M = {
  "Profile photo": {
    name: "Priya Nair",
    email: "priya@fernhill.co",
    current: `${$}/priya.webp`,
    shape: "circle",
    title: "Profile photo",
    samples: [
      { label: "priya-new.jpg", src: `${$}/priya-full.webp` },
      { label: "theo.jpg", src: `${$}/theo.webp` },
    ],
  },
  Editing: {
    name: "Theo Lin",
    email: "theo@fernhill.co",
    current: null,
    shape: "circle",
    title: "Profile photo",
    samples: [{ label: "theo.jpg", src: `${$}/theo.webp` }],
  },
  "Workspace logo": {
    name: "Fernhill",
    email: "fernhill.relay.app",
    current: null,
    shape: "square",
    title: "Workspace logo",
    hint: "PNG or SVG, with some room around the mark.",
    samples: [{ label: "fernhill-logo.png", src: `${$}/fernhill-logo.png` }],
  },
  "Save fails": {
    name: "Priya Nair",
    email: "priya@fernhill.co",
    current: `${$}/priya.webp`,
    shape: "circle",
    title: "Profile photo",
    samples: [{ label: "priya-new.jpg", src: `${$}/priya-full.webp` }],
  },
};
function N({ tab: e, scenario: a }) {
  let s = r.default.useRef(null),
    i = r.default.useRef(!1),
    [o, u] = r.default.useState(null),
    c = "square" === a.shape;
  return (
    r.default.useEffect(() => {
      if ("Editing" !== e) return;
      let t = setTimeout(() => s.current?.open(a.samples[0].src), 450);
      return () => clearTimeout(t);
    }, [e, a]),
    (0, t.jsxs)("div", {
      style: (0, k.demoAppearance)(),
      className: "w-full max-w-[440px] text-foreground",
      children: [
        (0, t.jsxs)("div", {
          className:
            "rounded-[22px] border border-border bg-background p-4 sm:p-5",
          children: [
            (0, t.jsxs)("div", {
              className: "flex items-baseline justify-between gap-3",
              children: [
                (0, t.jsx)("p", {
                  className: "text-[14px] font-medium tracking-[-0.01em]",
                  children: c ? "Workspace" : "Profile",
                }),
                (0, t.jsx)("p", {
                  className: "text-[11.5px] text-muted-foreground",
                  children: "Relay · Settings",
                }),
              ],
            }),
            (0, t.jsx)(z, {
              ref: s,
              className: "mt-4",
              name: a.name,
              defaultValue: a.current,
              shape: a.shape,
              title: a.title,
              hint: a.hint,
              onSave: async (t) => {
                if (
                  (await new Promise((e) => setTimeout(e, 900)),
                  "Save fails" === e && !i.current)
                )
                  throw ((i.current = !0), Error("Offline"));
                u({ kb: Math.max(1, Math.round(t.size / 1024)), side: 512 });
              },
              onRemove: async () => {
                (await new Promise((e) => setTimeout(e, 500)), u(null));
              },
            }),
            (0, t.jsxs)("dl", {
              className:
                "mt-5 divide-y divide-border border-t border-border text-[13px]",
              children: [
                (0, t.jsxs)("div", {
                  className: "flex items-baseline justify-between gap-3 py-2.5",
                  children: [
                    (0, t.jsx)("dt", {
                      className: "text-muted-foreground",
                      children: c ? "Workspace" : "Name",
                    }),
                    (0, t.jsx)("dd", { children: a.name }),
                  ],
                }),
                (0, t.jsxs)("div", {
                  className: "flex items-baseline justify-between gap-3 py-2.5",
                  children: [
                    (0, t.jsx)("dt", {
                      className: "text-muted-foreground",
                      children: c ? "Address" : "Email",
                    }),
                    (0, t.jsx)("dd", {
                      className: "truncate",
                      children: a.email,
                    }),
                  ],
                }),
                (0, t.jsxs)("div", {
                  className: "flex items-baseline justify-between gap-3 pt-2.5",
                  children: [
                    (0, t.jsx)("dt", {
                      className: "text-muted-foreground",
                      children: "Stored",
                    }),
                    (0, t.jsx)("dd", {
                      className: "tabular-nums text-muted-foreground",
                      children: o
                        ? (0, t.jsxs)("span", {
                            className: "inline-flex items-baseline",
                            children: [
                              "512 × 512 WebP, ",
                              (0, t.jsx)(l.NumberRoll, { value: o.kb }),
                              " KB",
                            ],
                          })
                        : (0, t.jsx)(j.TextMorph, {
                            children: a.current
                              ? "Original photo"
                              : "Nothing yet",
                          }),
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        (0, t.jsxs)("div", {
          className: "mt-3 flex flex-wrap items-center gap-1.5 px-1",
          children: [
            (0, t.jsx)("span", {
              className: "mr-1 text-[11.5px] text-muted-foreground",
              children: "Try:",
            }),
            a.samples.map((e) =>
              (0, t.jsxs)(
                "button",
                {
                  type: "button",
                  onClick: () => s.current?.open(e.src),
                  className:
                    "inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full px-2.5 text-[12px] shadow-[inset_0_0_0_1px_var(--border)] transition-colors hover:bg-accent",
                  children: [
                    (0, t.jsx)(n.default, {
                      className: "size-3.5 text-muted-foreground",
                      strokeWidth: 1.75,
                      "aria-hidden": "true",
                    }),
                    e.label,
                  ],
                },
                e.src,
              ),
            ),
            (0, t.jsx)("span", {
              className: "text-[11.5px] text-muted-foreground",
              children: "or your own: it never leaves the page.",
            }),
          ],
        }),
      ],
    })
  );
}
export default (function ({ tab: e = "Profile photo" }) {
  return (0, t.jsx)(N, { tab: e, scenario: M[e] ?? M["Profile photo"] }, e);
});
