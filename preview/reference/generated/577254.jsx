"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "lucide-react";
import * as dependency2 from "../../../registry/components/segmented-control";
("use strict");
var t = dependency0;
var l = dependency1;
var r = dependency1;
var a = dependency2;
export default (function ({ tab: e = "Views" }) {
  return "Icons" === e
    ? (0, t.jsx)(a.SegmentedControl, {
        label: "Editor mode",
        size: "sm",
        defaultValue: "write",
        options: [
          { value: "write", label: "Write", icon: (0, t.jsx)(l.Code2, {}) },
          { value: "preview", label: "Preview", icon: (0, t.jsx)(r.Eye, {}) },
        ],
      })
    : "Block" === e
      ? (0, t.jsx)("div", {
          className: "w-full max-w-[320px]",
          children: (0, t.jsx)(a.SegmentedControl, {
            label: "Range",
            block: !0,
            defaultValue: "30d",
            options: [
              { value: "7d", label: "7d" },
              { value: "30d", label: "30d" },
              { value: "90d", label: "90d" },
              { value: "12m", label: "12 months" },
            ],
          }),
        })
      : (0, t.jsx)(a.SegmentedControl, {
          label: "View",
          defaultValue: "week",
          options: [
            { value: "day", label: "Day" },
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
          ],
        });
});
