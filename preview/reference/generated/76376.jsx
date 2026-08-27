"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency3 from "../../../registry/components/textarea";
import * as dependency4 from "../../../registry/components/imported-ui-interaction-motion";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency2;
var i = dependency3;
var l = dependency4;
export default (function ({ tab: e = "Grow" }) {
  let [a, s] = r.useState(""),
    [o, u] = r.useState([]);
  if ("Limit" === e)
    return (0, t.jsx)("div", {
      className: "w-full max-w-[340px]",
      children: (0, t.jsx)(i.Textarea, {
        label: "Bio",
        maxLength: 80,
        minRows: 2,
        defaultValue:
          "Designer at Fernhill. I make the forms people never notice",
      }),
    });
  if ("Error" === e)
    return (0, t.jsx)("div", {
      className: "w-full max-w-[340px]",
      children: (0, t.jsx)(i.Textarea, {
        label: "Why are you leaving?",
        minRows: 2,
        error: "Tell us a little more; one line helps.",
      }),
    });
  let d = (e) => {
    e.trim() && (u((t) => [...t, e.trim()].slice(-2)), s(""));
  };
  return (0, t.jsxs)("div", {
    className: "flex w-full max-w-[360px] flex-col gap-3",
    children: [
      o.map((e, r) =>
        (0, t.jsx)(
          "p",
          {
            className:
              "self-end rounded-[16px] bg-muted px-3.5 py-2 text-[13px] text-foreground",
            children: e,
          },
          r,
        ),
      ),
      (0, t.jsx)(i.Textarea, {
        label: "Reply",
        placeholder: "Write a reply…",
        minRows: 2,
        maxRows: 6,
        value: a,
        onValueChange: s,
        onSubmit: d,
        hint: "It grows to six lines, then scrolls.",
        action: (0, t.jsx)("button", {
          type: "button",
          "aria-label": "Send",
          disabled: !a.trim(),
          onClick: () => d(a),
          className: `flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground cursor-pointer disabled:cursor-default disabled:bg-muted disabled:text-muted-foreground ${l.INTERACTION_PRESS} ${l.INTERACTION_FOCUS}`,
          children: (0, t.jsx)(n.ArrowUp, { size: 15 }),
        }),
      }),
    ],
  });
});
