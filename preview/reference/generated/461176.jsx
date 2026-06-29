"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency4 from "../../../registry/components/chat-scroll";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency2;
function u(props) {
  return dependency1.createElement(dependency4.ChatScroll, props);
}
let c = [
  {
    role: "user",
    text: "We open the second shop on Saturday. What should the first week look like?",
  },
];
let d = [
  `Treat the first week as a soft launch that builds into the weekend.

Monday and Tuesday: open to neighbours only. Hand flyers to the shops on your street and offer a free kids’ scoop. You get real customers without a queue you can’t handle yet.

Wednesday: invite the local food accounts for a tasting at 4pm, when the light is good and the shop is calm. Give them three flavours, not ten.

Thursday: fix what broke. Every new shop finds two or three problems, usually the till, the freezer layout and the queue path.

Friday: post the opening hours everywhere and pin the menu. Keep it to eight flavours so the counter moves fast.

Saturday: open an hour early, put your fastest scooper on the counter and someone on the door with tasting spoons. Pistachio will sell out first, so churn a double batch on Friday night.

Sunday: count what sold, what ran out and how long the queue got, and plan week two from that.`,
  `Short version: staff for the queue, not the average.

Two people on the counter from 2pm to 6pm, one on prep. Rotate scoopers every hour so nobody slows down, and keep a runner for cones and cups.

If the queue passes ten people, send someone down the line with a tasting tray and the menu so people order the moment they reach the counter.

Close the till at 9pm sharp the first night; you will need the hour to restock for Sunday.`,
];
export default (function () {
  let [e, o] = (0, r.useState)(c),
    [s, a] = (0, r.useState)(null),
    l = (0, r.useRef)(void 0),
    i = e.filter((e) => "user" === e.role).length,
    p = (e) => {
      let t = e.split(/(?<=\s)/),
        r = 0;
      (window.clearInterval(l.current),
        a(""),
        (l.current = window.setInterval(() => {
          ((r += 1),
            a(t.slice(0, r).join("")),
            r >= t.length &&
              (window.clearInterval(l.current),
              a(null),
              o((t) => [...t, { role: "assistant", text: e }])));
        }, 80)));
    };
  return (
    (0, r.useEffect)(
      () => (p(d[0]), () => window.clearInterval(l.current)),
      [],
    ),
    (0, t.jsxs)("div", {
      className: "flex w-full max-w-[520px] flex-col gap-2",
      children: [
        (0, t.jsxs)(u, {
          streaming: null !== s,
          followKey: i,
          className:
            "h-[300px] rounded-[22px] border border-border bg-background",
          contentClassName: "flex flex-col gap-4 px-5 py-5",
          children: [
            e.map((e, r) =>
              "user" === e.role
                ? (0, t.jsx)(
                    "p",
                    {
                      className:
                        "ml-auto w-fit max-w-[85%] rounded-[18px] bg-muted px-3.5 py-2 text-[13.5px] leading-relaxed text-foreground",
                      children: e.text,
                    },
                    r,
                  )
                : (0, t.jsx)(
                    "p",
                    {
                      className:
                        "whitespace-pre-wrap text-[13.5px] leading-relaxed text-foreground",
                      children: e.text,
                    },
                    r,
                  ),
            ),
            null !== s &&
              (0, t.jsxs)("p", {
                className:
                  "whitespace-pre-wrap text-[13.5px] leading-relaxed text-foreground",
                children: [
                  s,
                  (0, t.jsx)("span", {
                    "aria-hidden": "true",
                    className:
                      "ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-[ui-blink_1s_steps(1)_infinite] bg-foreground/70",
                  }),
                ],
              }),
          ],
        }),
        (0, t.jsxs)("div", {
          className: "flex items-center justify-between px-1",
          children: [
            (0, t.jsx)("span", {
              className: "text-[12px] text-muted-foreground",
              children: "Scroll up while it writes.",
            }),
            (0, t.jsxs)("button", {
              type: "button",
              onClick: () => {
                null === s &&
                  (o((e) => [
                    ...e,
                    {
                      role: "user",
                      text: "How many people should be on shift Saturday?",
                    },
                  ]),
                  p(d[i % d.length]));
              },
              disabled: null !== s,
              className:
                "cursor-pointer disabled:cursor-default flex h-8 items-center gap-1.5 rounded-full bg-primary pl-3 pr-2.5 text-[12.5px] font-medium text-primary-foreground transition-[opacity,transform] active:scale-[0.96] disabled:opacity-35",
              children: [
                "Ask a follow-up",
                (0, t.jsx)(n.ArrowUp, {
                  className: "size-3.5",
                  strokeWidth: 2.4,
                }),
              ],
            }),
          ],
        }),
      ],
    })
  );
});
