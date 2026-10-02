"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency6 from "../../../registry/components/doc-comments";
import * as dependency7 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
function k(props) {
  return dependency1.createElement(dependency6.DocComments, props);
}
var j = dependency7;
let S = {
  id: "priya",
  name: "Priya Nair",
  image: "/demos/cavemio/ui-assets/avatar-cropper/priya.webp",
};
let N = {
  id: "theo",
  name: "Theo Brandt",
  image: "/demos/cavemio/ui-assets/avatar-cropper/theo.webp",
};
let C = { id: "leo", name: "Leo Park" };
let $ = { id: "ana", name: "Ana Ruiz" };
let R = 0;
let E = (e, t, r) => ({
  id: `c${R++}`,
  author: e,
  body: t,
  createdAt: new Date(Date.now() - 6e4 * r),
});
let M = [
  {
    id: "t1",
    anchor: { quote: "Tuesday, October 24", prefix: "We ship Relay 2.4 on " },
    comments: [
      E(
        S,
        "Can we move this to the 25th? The billing freeze ends on the 24th.",
        190,
      ),
      E(
        N,
        "Checked with finance: the freeze lifts at midnight, so the 24th works.",
        75,
      ),
    ],
  },
  {
    id: "t2",
    anchor: { quote: "nobody pays more in the first year" },
    comments: [
      E(N, "Does this hold for the three legacy enterprise accounts too?", 52),
    ],
  },
  {
    id: "t3",
    anchor: { quote: "400 workspaces" },
    comments: [
      E(C, "Where does 400 come from? The last launch did 260.", 1600),
      E(
        S,
        "Trials are up 50% since then. 400 is the stretch number, 320 the plan.",
        1440,
      ),
    ],
  },
  {
    id: "t4",
    anchor: { quote: "who owns the migration email" },
    comments: [E(S, "I’ll take it. Draft by Friday.", 12)],
  },
];
let T = [
  ...M,
  {
    id: "t5",
    anchor: { quote: "usage-based pricing" },
    comments: [
      E(
        C,
        "Say “pay for what you use” here. Usage-based reads like a bill.",
        40,
      ),
    ],
  },
  {
    id: "t6",
    anchor: { quote: "Existing customers keep their current plan" },
    comments: [E(S, "Link the plans page so people can check theirs.", 33)],
  },
  {
    id: "t7",
    anchor: { quote: "9:00 Pacific" },
    comments: [E(N, "Europe will be at dinner. 8:00?", 21)],
  },
  {
    id: "t8",
    anchor: { quote: "two days before" },
    comments: [E(C, "Make it three. Support asked for a dry run.", 9)],
  },
];
let z = {
  Review:
    "Choose a thread or its highlight: it lines up with its line and the rest make way. ✓ resolves it.",
  "New comment": "Select any words, then choose Comment (or press Ctrl+Alt+M).",
  "Crowded margin":
    "Eight threads in four paragraphs: they stack, and the one you choose sits exactly beside its line.",
  "Save fails":
    "The first comment, reply or resolve fails: your words stay and the button says Try again.",
};
export default (function ({ tab: e = "Review" }) {
  let [n, a] = r.default.useState(
      "Crowded margin" === e ? T : "New comment" === e ? M.slice(2, 3) : M,
    ),
    i = r.default.useRef({ create: !1, reply: !1, resolve: !1 }),
    s = async (t) => {
      if (
        (await new Promise((e) => setTimeout(e, 700)),
        "Save fails" === e && !i.current[t])
      )
        throw ((i.current[t] = !0), Error("Offline"));
    };
  return (0, t.jsxs)("div", {
    style: (0, j.demoAppearance)(),
    className: "w-full max-w-[820px] text-foreground",
    children: [
      (0, t.jsx)("div", {
        className:
          "rounded-[18px] border border-border bg-background px-5 py-6 sm:px-7",
        children: (0, t.jsx)(k, {
          threads: n,
          onThreadsChange: a,
          user: $,
          label: "Launch plan comments",
          onCreate: () => s("create"),
          onReply: () => s("reply"),
          onResolve: () => s("resolve"),
          children: (0, t.jsxs)("article", {
            className:
              "max-w-[60ch] text-[14px] leading-[1.7] text-foreground/90",
            children: [
              (0, t.jsx)("p", {
                className: "text-[12px] text-muted-foreground",
                children: "Relay · Specs",
              }),
              (0, t.jsx)("h3", {
                className:
                  "mt-1 text-[20px] font-semibold leading-tight tracking-[-0.02em] text-foreground",
                children: "Relay 2.4 launch plan",
              }),
              (0, t.jsx)("p", {
                className: "mt-4",
                children:
                  "We ship Relay 2.4 on Tuesday, October 24, with usage-based pricing for every new workspace. Existing customers keep their current plan until their next renewal, and nobody pays more in the first year.",
              }),
              (0, t.jsx)("p", {
                className: "mt-3",
                children:
                  "The launch post goes out at 9:00 Pacific, followed by the changelog and an email to admins. Support gets the FAQ two days before, and the pricing page switches over the moment the post is live.",
              }),
              (0, t.jsx)("p", {
                className: "mt-3",
                children:
                  "Success means 400 workspaces on the new plans in the first month, with churn no higher than it is today. We review the numbers in the weekly growth meeting and decide on a wider rollout in December.",
              }),
              (0, t.jsx)("p", {
                className: "mt-3",
                children:
                  "Open questions: who owns the migration email, and whether annual plans get the same discount.",
              }),
            ],
          }),
        }),
      }),
      (0, t.jsx)("p", {
        className: "mt-2 px-1 text-[11.5px] text-muted-foreground",
        children: z[e] ?? z.Review,
      }),
    ],
  });
});
