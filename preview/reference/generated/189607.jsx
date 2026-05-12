"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency4 from "../../../registry/components/chat-history";
("use strict");
var t = dependency0;
var r = dependency1;
function v(props) {
  return dependency1.createElement(dependency4.ChatHistory, props);
}
let j = [
  "Saturday staffing plan",
  "Tasting event guest list",
  "Price list for the new shop",
];
export default (function ({ tab: e = "Live" }) {
  let [n, a] = (0, r.useState)(() => {
      let e;
      return [
        {
          id: "c1",
          title: "Autumn menu launch plan",
          updatedAt: (e = Date.now()) - 18e5,
          pinned: !0,
        },
        { id: "c2", title: "Pistachio supplier prices", updatedAt: e - 72e5 },
        {
          id: "c3",
          title: "Opening week Instagram posts",
          updatedAt: e - 18e6,
        },
        {
          id: "c4",
          title: "Rewrite the loyalty card copy",
          updatedAt: e - 95040000.00000001,
        },
        {
          id: "c5",
          title: "Queue layout for weekends",
          updatedAt: e - 120959999.99999999,
        },
        { id: "c6", title: "Staff rota for August", updatedAt: e - 2592e5 },
        { id: "c7", title: "Dairy-free flavour ideas", updatedAt: e - 432e6 },
        {
          id: "c8",
          title: "Harbour Road lease questions",
          updatedAt: e - 10368e5,
        },
        { id: "c9", title: "Launch budget spreadsheet", updatedAt: e - 1728e6 },
      ];
    }),
    [i, o] = (0, r.useState)("c2"),
    s = (0, r.useRef)(0),
    l = (0, r.useRef)([]);
  (0, r.useEffect)(
    () => () => l.current.forEach((e) => window.clearTimeout(e)),
    [],
  );
  let u = () => {
    let e = `new-${s.current}`,
      t = j[s.current++ % j.length];
    (a((t) => [{ id: e, updatedAt: Date.now(), generating: !0 }, ...t]),
      o(e),
      l.current.push(
        window.setTimeout(
          () =>
            a((r) =>
              r.map((r) =>
                r.id === e ? { ...r, title: t, generating: !1 } : r,
              ),
            ),
          1600,
        ),
      ));
  };
  return (
    (0, r.useEffect)(() => {
      "Live" === e && l.current.push(window.setTimeout(u, 900));
    }, [e]),
    (0, t.jsx)("div", {
      className:
        "h-[340px] w-full max-w-[300px] rounded-[20px] border border-border bg-background p-2",
      children: (0, t.jsx)(v, {
        className: "h-full",
        chats: n,
        activeId: i,
        defaultQuery: "Search" === e ? "launch" : "",
        onSelect: o,
        onNew: u,
        onRename: (e, t) =>
          a((r) => r.map((r) => (r.id === e ? { ...r, title: t } : r))),
        onPin: (e, t) =>
          a((r) => r.map((r) => (r.id === e ? { ...r, pinned: t } : r))),
        onDelete: (e) => a((t) => t.filter((t) => t.id !== e)),
      }),
    })
  );
});
