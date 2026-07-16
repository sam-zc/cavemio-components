"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency3 from "./386507.jsx";
import * as dependency4 from "../icon-factory";
import * as dependency7 from "../../../registry/components/floating-button-group";
("use strict");
var t = dependency0;
var n = dependency1;
var r = dependency2;
var i = dependency2;
var s = dependency3;
let o = (0, dependency4.default)("MousePointer", [
  ["path", { d: "M12.586 12.586 19 19", key: "ea5xo7" }],
  [
    "path",
    {
      d: "M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z",
      key: "277e5u",
    },
  ],
]);
var a = dependency2;
var l = dependency2;
var c = dependency2;
var d = dependency2;
function g(props) {
  return dependency1.createElement(dependency7.FloatingButtonGroup, props);
}
export default (function ({ tab: e = "Canvas" }) {
  let [u, x] = n.useState("select"),
    [f, h] = n.useState(100),
    [m, p] = n.useState("Active tool: Select (V)"),
    y = [
      {
        id: "select",
        label: "Select",
        icon: (0, t.jsx)(o, { size: 14 }),
        shortcut: "V",
        onClick: () => p("Active tool: Select (V)"),
      },
      {
        id: "hand",
        label: "Hand tool",
        icon: (0, t.jsx)(i.Hand, { size: 14 }),
        shortcut: "H",
        onClick: () => p("Active tool: Hand tool (H)"),
      },
      {
        id: "frame",
        label: "Frame",
        icon: (0, t.jsx)(l.Square, { size: 14 }),
        shortcut: "F",
        onClick: () => p("Active tool: Frame (F)"),
      },
      {
        id: "text",
        label: "Text",
        icon: (0, t.jsx)(d.Type, { size: 14 }),
        shortcut: "T",
        onClick: () => p("Active tool: Text (T)"),
      },
    ];
  return "Stepper" === e
    ? (0, t.jsxs)("div", {
        className:
          "flex w-full max-w-[360px] flex-col items-center justify-center gap-6 py-4 px-2",
        children: [
          (0, t.jsx)(g, {
            tools: y,
            activeId: u,
            onToolSelect: (e) => x(e),
            zoomValue: f,
            onZoomChange: (e) => {
              (h(e), p(`Zoom adjusted to ${e}%`));
            },
          }),
          (0, t.jsx)("span", {
            className:
              "text-center text-[12px] tabular-nums text-muted-foreground",
            children: m,
          }),
        ],
      })
    : "Actions" === e
      ? (0, t.jsxs)("div", {
          className:
            "flex w-full max-w-[360px] flex-col items-center justify-center gap-6 py-4 px-2",
          children: [
            (0, t.jsx)(g, {
              tools: y,
              activeId: u,
              onToolSelect: (e) => x(e),
              menuItems: [
                {
                  id: "export",
                  label: "Export canvas",
                  icon: (0, t.jsx)(r.Download, { size: 13 }),
                  onSelect: () => p("Exporting canvas image..."),
                },
                {
                  id: "share",
                  label: "Share canvas link",
                  icon: (0, t.jsx)(a.Share2, { size: 13 }),
                  onSelect: () => p("Copied share link to clipboard"),
                },
                {
                  id: "clear",
                  label: "Clear workspace",
                  icon: (0, t.jsx)(c.Trash2, { size: 13 }),
                  destructive: !0,
                  onSelect: () => p("Workspace cleared"),
                },
              ],
            }),
            (0, t.jsx)("span", {
              className:
                "text-center text-[12px] tabular-nums text-muted-foreground",
              children: m,
            }),
          ],
        })
      : (0, t.jsxs)("div", {
          className:
            "flex w-full max-w-[340px] flex-col items-center justify-center gap-6 py-4 px-2",
          children: [
            (0, t.jsx)(g, {
              tools: [
                ...y,
                {
                  id: "image",
                  label: "Insert image",
                  icon: (0, t.jsx)(s.Image, { size: 14 }),
                  shortcut: "I",
                  onClick: () => p("Active tool: Insert image (I)"),
                },
              ],
              activeId: u,
              onToolSelect: (e) => x(e),
            }),
            (0, t.jsx)("span", {
              className:
                "text-center text-[12px] tabular-nums text-muted-foreground",
              children: m,
            }),
          ],
        });
});
