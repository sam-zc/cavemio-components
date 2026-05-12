"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "../../../registry/components/checkbox";
("use strict");
var n = dependency0;
var s = dependency1;
var o = dependency2;
let r = ["Pick the photos", "Write the release note", "Send it to Northwind"];
export default (function ({ tab: e = "Single" }) {
  let [t, a] = s.useState([!0, !1, !1]);
  if ("Group" === e) {
    let e = t.every(Boolean),
      s = t.some(Boolean);
    return (0, n.jsxs)("div", {
      className: "flex w-full max-w-[300px] flex-col gap-3",
      children: [
        (0, n.jsx)(o.Checkbox, {
          label: "Launch checklist",
          checked: !!e || (!!s && "mixed"),
          onCheckedChange: () => a(t.map(() => !e)),
        }),
        (0, n.jsx)("div", {
          className: "flex flex-col gap-2.5 pl-6",
          children: r.map((e, s) =>
            (0, n.jsx)(
              o.Checkbox,
              {
                label: e,
                checked: t[s],
                onCheckedChange: (e) => a(t.map((n, o) => (o === s ? e : n))),
              },
              e,
            ),
          ),
        }),
      ],
    });
  }
  return (0, n.jsxs)("div", {
    className: "flex w-full max-w-[300px] flex-col gap-4",
    children: [
      (0, n.jsx)(o.Checkbox, {
        label: "Email me about new templates",
        description: "About once a month, never more.",
        defaultChecked: !0,
      }),
      (0, n.jsx)(o.Checkbox, {
        label: "Share anonymous usage",
        description: "Which components you open, nothing else.",
      }),
    ],
  });
});
