"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency3 from "../icon-factory";
import * as dependency4 from "../../../registry/components/model-picker";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency2;
var s = dependency2;
let a = (0, dependency3.default)("Gem", [
  ["path", { d: "M6 3h12l4 6-10 13L2 9Z", key: "1pcd5k" }],
  ["path", { d: "M11 3 8 9l4 13 4-13-3-6", key: "1fcu3u" }],
  ["path", { d: "M2 9h20", key: "16fsjt" }],
]);
var i = dependency2;
var o = dependency2;
var l = dependency2;
var d = dependency4;
let c = [
  {
    id: "aurora-mini",
    name: "Aurora Mini",
    description: "Fast, everyday questions",
    icon: (0, t.jsx)(l.Zap, {}),
    speed: 3,
    intelligence: 1,
  },
  {
    id: "aurora",
    name: "Aurora",
    description: "Balanced for most work",
    icon: (0, t.jsx)(o.Sparkle, {}),
    speed: 2,
    intelligence: 2,
  },
  {
    id: "aurora-think",
    name: "Aurora Think",
    description: "Reasons before it answers",
    icon: (0, t.jsx)(s.Brain, {}),
    speed: 1,
    intelligence: 3,
    reasoning: !0,
  },
  {
    id: "aurora-ultra",
    name: "Aurora Ultra",
    description: "The longest, hardest problems",
    icon: (0, t.jsx)(a, {}),
    speed: 1,
    intelligence: 3,
    reasoning: !0,
    locked: !0,
  },
];
export default (function () {
  let [e, s] = (0, r.useState)("aurora-think"),
    [a, o] = (0, r.useState)("Medium"),
    [l, u] = (0, r.useState)(!1),
    p = (0, r.useRef)(null);
  return (0, t.jsxs)("div", {
    className:
      "flex min-h-[380px] w-full max-w-[500px] flex-col justify-end gap-3",
    children: [
      (0, t.jsxs)("div", {
        ref: p,
        className: "rounded-[22px] border border-border bg-background p-2",
        children: [
          (0, t.jsx)("p", {
            className:
              "px-2.5 pb-3 pt-1.5 text-[14px] leading-6 text-muted-foreground",
            children: "Plan the autumn menu launch",
          }),
          (0, t.jsxs)("div", {
            className: "flex items-center gap-1",
            children: [
              (0, t.jsx)("button", {
                type: "button",
                "aria-label": "Attach",
                className:
                  "cursor-pointer flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                children: (0, t.jsx)(i.Paperclip, { className: "size-4" }),
              }),
              (0, t.jsx)(d.ModelPicker, {
                models: c,
                value: e,
                onValueChange: (e) => {
                  (s(e), u(!1));
                },
                effort: a,
                onEffortChange: o,
                onLockedSelect: () => u(!0),
                align: "end",
                collisionPadding: 28,
                anchorRef: p,
                className: "ml-auto",
              }),
              (0, t.jsx)("button", {
                type: "button",
                "aria-label": "Send",
                className:
                  "cursor-pointer flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-[0.94]",
                children: (0, t.jsx)(n.ArrowUp, {
                  className: "size-4",
                  strokeWidth: 2.4,
                }),
              }),
            ],
          }),
        ],
      }),
      (0, t.jsx)("p", {
        "aria-live": "polite",
        className: "h-4 px-1 text-[12px] text-muted-foreground",
        children:
          l &&
          (0, t.jsx)("span", {
            className: "animate-[ui-fade-in_250ms_ease-out_both]",
            children:
              "Aurora Ultra is on the Pro plan. In your app, this opens pricing.",
          }),
      }),
    ],
  });
});
