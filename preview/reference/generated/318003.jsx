"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency3 from "../icon-factory";
import * as dependency4 from "../../../registry/components/number-roll";
import * as dependency5 from "../../../registry/components/imported-ui-interaction-motion";
import * as dependency6 from "../../../registry/components/swipe-actions";
import * as dependency7 from "../../../registry/components/text-morph";
import * as dependency8 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency2;
let a = (0, dependency3.default)("MailOpen", [
  [
    "path",
    {
      d: "M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z",
      key: "1jhwl8",
    },
  ],
  ["path", { d: "m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10", key: "1qfld7" }],
]);
var i = dependency2;
var s = dependency2;
var o = dependency2;
var l = dependency4;
var d = dependency5;
function v(props) {
  return dependency1.createElement(dependency6.SwipeActions, props);
}
var b = dependency7;
var y = dependency8;
let w = [
  {
    id: "m1",
    from: "Ana Ruiz",
    initials: "AR",
    subject: "The pistachio batch is back",
    preview: "Roasted a fresh lot this morning. Tasting at four?",
    time: "9:41",
    unread: !0,
    pinned: !1,
  },
  {
    id: "m2",
    from: "Northwind Dairy",
    initials: "ND",
    subject: "Delivery moved to Thursday",
    preview: "Your standing order now arrives between 7 and 9.",
    time: "8:15",
    unread: !0,
    pinned: !1,
  },
  {
    id: "m3",
    from: "Tom Okafor",
    initials: "TO",
    subject: "Weekend rota",
    preview: "Swapped Saturday close with Mei, hope that works.",
    time: "Yesterday",
    unread: !1,
    pinned: !1,
  },
  {
    id: "m4",
    from: "Fernhill Studio",
    initials: "FS",
    subject: "Autumn menu proofs",
    preview: "Three options attached; the second uses the new type.",
    time: "Mon",
    unread: !1,
    pinned: !1,
  },
];
export default (function ({ tab: e = "Inbox" }) {
  let u = (0, d.useInteractionReducedMotion)(),
    [c, m] = r.useState(w),
    [p, f] = r.useState(null),
    [g, h] = r.useState(null),
    x = r.useRef(new Set()),
    k = r.useRef(new Set());
  r.useEffect(() => () => k.current.forEach(clearTimeout), []);
  let j = r.useRef(c);
  j.current = c;
  let M = (e, t) => m((r) => r.map((r) => (r.id === e ? { ...r, ...t } : r))),
    N = c.filter((e) => e.unread).length;
  return (0, t.jsxs)("div", {
    style: (0, y.demoAppearance)(),
    className: "w-full max-w-[440px] text-foreground",
    children: [
      (0, t.jsxs)("div", {
        className: "flex items-baseline justify-between px-1",
        children: [
          (0, t.jsx)("p", {
            className: "text-[14px] font-medium tracking-[-0.01em]",
            children: "Inbox",
          }),
          (0, t.jsxs)("p", {
            className: "text-[12px] tabular-nums text-muted-foreground",
            children: [(0, t.jsx)(l.NumberRoll, { value: N }), " unread"],
          }),
        ],
      }),
      (0, t.jsxs)("div", {
        className:
          "mt-3 overflow-hidden rounded-[18px] border border-border bg-background [&>*:last-child]:-mb-px",
        children: [
          c.map((r) =>
            (0, t.jsx)(
              v,
              {
                label: `${r.from}: ${r.subject}`,
                meta: r.time,
                enter: g === r.id,
                leading: [
                  {
                    id: "read",
                    label: r.unread ? "Read" : "Unread",
                    icon: r.unread ? (0, t.jsx)(a, {}) : (0, t.jsx)(n.Mail, {}),
                    tone: "primary",
                    onAction: () => M(r.id, { unread: !r.unread }),
                  },
                ],
                trailing: [
                  {
                    id: "delete",
                    label: "Delete",
                    icon: (0, t.jsx)(o.Trash2, {}),
                    tone: "destructive",
                    removes: !0,
                    onAction: async () => {
                      if (
                        (await new Promise((e) => {
                          let t = setTimeout(() => {
                            (k.current.delete(t), e());
                          }, 450);
                          k.current.add(t);
                        }),
                        "Fails once" === e && !x.current.has(r.id))
                      )
                        throw (x.current.add(r.id), Error("Offline"));
                      (f({
                        message: r,
                        index: j.current.findIndex((e) => e.id === r.id),
                      }),
                        m((e) => e.filter((e) => e.id !== r.id)));
                    },
                  },
                  {
                    id: "pin",
                    label: r.pinned ? "Unpin" : "Pin",
                    icon: r.pinned
                      ? (0, t.jsx)(s.PinOff, {})
                      : (0, t.jsx)(i.Pin, {}),
                    onAction: () => M(r.id, { pinned: !r.pinned }),
                  },
                ],
                children: (0, t.jsxs)("div", {
                  className: "flex items-center gap-3",
                  children: [
                    (0, t.jsxs)("span", {
                      className:
                        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-[10.5px] font-medium text-muted-foreground",
                      children: [
                        r.initials,
                        (0, t.jsx)("span", {
                          className:
                            "absolute -left-0.5 top-0 size-2 rounded-full bg-primary ring-2 ring-background transition-[transform,opacity] duration-300",
                          style: {
                            opacity: +!!r.unread,
                            transform: r.unread ? "none" : "scale(0.3)",
                          },
                        }),
                      ],
                    }),
                    (0, t.jsxs)("span", {
                      className: "min-w-0 flex-1",
                      children: [
                        (0, t.jsxs)("span", {
                          className: "flex items-center gap-1.5",
                          children: [
                            (0, t.jsx)("span", {
                              className: `truncate text-[13px] transition-[font-weight] ${r.unread ? "font-semibold" : "font-medium"}`,
                              children: r.from,
                            }),
                            (0, t.jsx)(i.Pin, {
                              className:
                                "size-3 shrink-0 rotate-45 text-primary",
                              strokeWidth: 2,
                              style: (0, d.interactionIcon)(r.pinned, u),
                              "aria-hidden": "true",
                            }),
                          ],
                        }),
                        (0, t.jsxs)("span", {
                          className:
                            "mt-0.5 block truncate text-[12px] text-muted-foreground",
                          children: [
                            (0, t.jsx)("span", {
                              className: r.unread ? "text-foreground" : "",
                              children: r.subject,
                            }),
                            " · ",
                            r.preview,
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              },
              r.id,
            ),
          ),
          0 === c.length &&
            (0, t.jsx)("p", {
              className:
                "px-4 py-8 text-center text-[12px] text-muted-foreground",
              children: "All caught up.",
            }),
        ],
      }),
      (0, t.jsxs)("div", {
        className:
          "mt-3 flex h-7 items-center justify-between gap-3 px-1 text-[11.5px] text-muted-foreground",
        children: [
          (0, t.jsx)("span", {
            className: "truncate",
            children: (0, t.jsx)(b.TextMorph, {
              children: p
                ? `Deleted “${p.message.subject}”`
                : "Swipe a row either way, or hover it.",
            }),
          }),
          (0, t.jsx)("button", {
            type: "button",
            tabIndex: p ? 0 : -1,
            "aria-hidden": !p,
            onClick: () => {
              if (!p) return;
              let { message: e, index: t } = p;
              (h(e.id),
                m((r) => [...r.slice(0, t), e, ...r.slice(t)]),
                f(null));
            },
            className:
              "shrink-0 cursor-pointer rounded-full px-2.5 py-1 font-medium text-foreground transition-[opacity,background-color] duration-200 hover:bg-muted",
            style: { opacity: +!!p, pointerEvents: p ? "auto" : "none" },
            children: "Undo",
          }),
        ],
      }),
    ],
  });
});
