"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency3 from "../icon-factory";
import * as dependency4 from "../../../registry/components/hold-to-confirm";
import * as dependency5 from "../../../registry/components/text-morph";
import * as dependency6 from "./25369.jsx";
("use strict");
var r = dependency0;
var t = dependency1;
var n = dependency2;
let o = (0, dependency3.default)("ArchiveRestore", [
  [
    "rect",
    { width: "20", height: "5", x: "2", y: "3", rx: "1", key: "1wp1u1" },
  ],
  ["path", { d: "M4 8v11a2 2 0 0 0 2 2h2", key: "tvwodi" }],
  ["path", { d: "M20 8v11a2 2 0 0 1-2 2h-2", key: "1gkqxj" }],
  ["path", { d: "m9 15 3-3 3 3", key: "1pd0qc" }],
  ["path", { d: "M12 12v9", key: "192myk" }],
]);
var i = dependency2;
var s = dependency4;
var a = dependency5;
var c = dependency6;
export default (function ({ tab: e }) {
  let [d, u] = t.default.useState(!1),
    l = t.default.useRef(0),
    f = t.default.useRef(null);
  t.default.useEffect(
    () => () => {
      f.current && clearTimeout(f.current);
    },
    [],
  );
  let m = async () => {
    if (
      (await new Promise((e) => {
        f.current = setTimeout(e, 500);
      }),
      "Fails once" === e && 0 == l.current++)
    )
      throw Error("Demo request failed");
    u((e) => !e);
  };
  return (0, r.jsx)("div", {
    style: (0, c.demoAppearance)(),
    className: "w-full max-w-[390px] text-foreground",
    children: (0, r.jsxs)("div", {
      className: "rounded-[22px] border border-border bg-background p-6",
      children: [
        (0, r.jsxs)("div", {
          className: "flex items-center justify-between",
          children: [
            (0, r.jsx)("span", {
              className:
                "flex size-10 items-center justify-center rounded-xl border border-border bg-muted/30 text-primary",
              children: (0, r.jsx)(i.Folder, {
                className: "size-4",
                "aria-hidden": "true",
              }),
            }),
            (0, r.jsx)("span", {
              className:
                "font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground",
              children: "Studio / 018",
            }),
          ],
        }),
        (0, r.jsx)("h3", {
          className: "mt-6 text-[26px] font-medium tracking-[-0.04em]",
          children: "Summer campaign.",
        }),
        (0, r.jsx)("div", {
          className:
            "mt-2 min-h-14 text-[12px] leading-relaxed text-muted-foreground",
          children: (0, r.jsx)(a.TextMorph, {
            animateWidth: !1,
            children: d
              ? "Safely in the archive. Your files are kept together, ready when you need them."
              : "Finished for now? Keep the work, and make a little room for what comes next.",
          }),
        }),
        (0, r.jsx)("div", {
          className: "mt-5 border-t border-border pt-5",
          children: (0, r.jsx)(s.HoldToConfirm, {
            onConfirm: m,
            icon: d ? (0, r.jsx)(o, {}) : (0, r.jsx)(n.Archive, {}),
            labels: {
              idle: d ? "Hold to restore" : "Hold to archive",
              pending: "Saving change",
              success: d ? "Project archived" : "Project restored",
            },
          }),
        }),
        (0, r.jsx)("p", {
          className: "mt-4 text-[10px] text-muted-foreground",
          children: "Hold for a moment. Release early to cancel.",
        }),
      ],
    }),
  });
});
