"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency8 from "../../../registry/components/notification-inbox";
import * as dependency9 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
function v(props) {
  return dependency1.createElement(dependency8.NotificationInbox, props);
}
var y = dependency9;
let w = (e) => new Promise((t) => setTimeout(t, e));
let j = (e) => new Date(Date.now() - 6e4 * e);
let k = [
  {
    title: "Priya Nair replied to your comment",
    body: "“Agreed, let’s ship the shorter version.”",
    actor: { name: "Priya Nair" },
  },
  {
    title: "Webhook deliveries to api.northwind.dev are failing",
    body: "5 attempts returned 503 in the last 10 minutes.",
    actor: { name: "Relay" },
  },
  {
    title: "Tom Becker requested access to “Roadmap”",
    actor: { name: "Tom Becker" },
  },
  {
    title: "Leo Park mentioned you in “Release notes”",
    body: "Does the changelog need the new export?",
    actor: { name: "Leo Park" },
  },
];
function N({ tab: e }) {
  let [n, a] = r.default.useState(() =>
      ((e = !1) =>
        [
          {
            id: "n1",
            title: "Maya Chen mentioned you in “Q4 launch plan”",
            body: "Can you check the pricing copy before Friday? The annual price changed.",
            at: j(4),
            read: !1,
            actor: { name: "Maya Chen" },
          },
          {
            id: "n2",
            title:
              "Leo Park assigned you “Checkout times out on slow networks”",
            body: "REL-482 · High priority",
            at: j(58),
            read: !1,
            actor: { name: "Leo Park" },
          },
          {
            id: "n3",
            title: "relay-web is live in production",
            body: "Deploy 2f8c41d finished in 1 min 12 s.",
            at: j(190),
            read: !0,
            actor: { name: "Relay" },
          },
          {
            id: "n4",
            title: "Ana Ruiz commented on “Invite flow”",
            body: "“Pasting a list from a spreadsheet works beautifully now.”",
            at: j(1560),
            read: !0,
            actor: { name: "Ana Ruiz" },
          },
          {
            id: "n5",
            title: "Fernhill paid invoice IN-0412",
            body: "$390.00 · Visa ending 4242",
            at: j(1800),
            read: !0,
            actor: { name: "Billing" },
          },
          {
            id: "n6",
            title: "Sam Okafor joined Fernhill",
            at: j(4320),
            read: !0,
            actor: { name: "Sam Okafor" },
          },
        ].map((t) => (e ? { ...t, read: !0 } : t)))("Caught up" === e),
    ),
    i = r.default.useRef(0),
    s = r.default.useCallback(
      (t) => {
        if ("Live" !== e) return () => {};
        let r = window.setInterval(() => {
          t({
            ...k[i.current % k.length],
            id: `live-${++i.current}`,
            at: new Date(),
            read: !1,
          });
        }, 5200);
        return () => window.clearInterval(r);
      },
      [e],
    );
  return (0, t.jsxs)(t.Fragment, {
    children: [
      (0, t.jsxs)("div", {
        className:
          "flex h-14 items-center gap-4 rounded-[16px] border border-border bg-background px-4",
        children: [
          (0, t.jsx)("span", {
            className:
              "inline-flex size-7 items-center justify-center rounded-[9px] bg-primary text-[12px] font-semibold text-primary-foreground",
            children: "R",
          }),
          (0, t.jsxs)("nav", {
            className:
              "hidden items-center gap-4 text-[13px] text-muted-foreground sm:flex",
            children: [
              (0, t.jsx)("span", {
                className: "text-foreground",
                children: "Projects",
              }),
              (0, t.jsx)("span", { children: "Reviews" }),
              (0, t.jsx)("span", { children: "Settings" }),
            ],
          }),
          (0, t.jsx)("span", { className: "ml-auto" }),
          (0, t.jsx)(v, {
            value: n,
            onValueChange: a,
            subscribe: s,
            defaultOpen: "Live" !== e,
            onRead: () => w(300),
            onArchive: () => w(300),
            loadMore: async () => (await w(700), []),
          }),
        ],
      }),
      (0, t.jsx)("p", {
        className:
          "mt-auto pt-6 text-center text-[11.5px] text-muted-foreground",
        children:
          "Live" === e
            ? "A new notification arrives every few seconds. Open the bell."
            : "Open a notification, archive one, or mark them all read.",
      }),
    ],
  });
}
export default (function ({ tab: e = "Inbox" }) {
  return (0, t.jsx)("div", {
    style: (0, y.demoAppearance)(),
    className:
      "flex min-h-[560px] w-full max-w-[720px] flex-col text-foreground",
    children: (0, t.jsx)(N, { tab: e }, e),
  });
});
