"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency5 from "../../../registry/components/week-calendar";
import * as dependency6 from "./25369.jsx";
("use strict");
var t = dependency0;
var r = dependency1;
function M(props) {
  return dependency1.createElement(dependency5.WeekCalendar, props);
}
var D = dependency6;
let T = (e, t, r = 0) => {
  let n,
    a =
      ((n = new Date()).setHours(0, 0, 0, 0),
      n.setDate(n.getDate() - ((n.getDay() + 6) % 7)),
      n);
  return (a.setDate(a.getDate() + e), a.setHours(t, r, 0, 0), a);
};
export default (function ({ tab: e = "Plan your week" }) {
  var n;
  let a = r.default.useRef(!1),
    i = "Save fails" === e,
    o = async () => {
      if ((await new Promise((e) => setTimeout(e, 650)), i && !a.current))
        throw ((a.current = !0), Error("Offline"));
    };
  return (0, t.jsxs)("div", {
    style: (0, D.demoAppearance)(),
    className: "w-full max-w-[720px] text-foreground",
    children: [
      (0, t.jsx)("div", {
        className:
          "rounded-[22px] border border-border bg-background p-3 sm:p-4",
        children: (0, t.jsx)(
          M,
          {
            label: "Relay team calendar",
            defaultEvents:
              ((n = "Overlaps" === e),
              [
                ...[0, 1, 2, 3, 4].map((e) => ({
                  id: `standup-${e}`,
                  title: "Standup",
                  start: T(e, 9, 30),
                  end: T(e, 9, 45),
                  tone: 2,
                })),
                {
                  id: "sprint",
                  title: "Plan the sprint",
                  start: T(0, 10),
                  end: T(0, 11),
                  tone: 1,
                },
                {
                  id: "review",
                  title: "Design review · Fernhill",
                  start: T(1, 10),
                  end: T(1, 11, 30),
                  tone: 4,
                },
                {
                  id: "maya",
                  title: "1:1 with Maya",
                  start: T(1, 10, 30),
                  end: T(1, 11),
                  tone: 3,
                },
                ...(n
                  ? [
                      {
                        id: "hiring",
                        title: "Hiring sync",
                        start: T(1, 10, 15),
                        end: T(1, 11, 15),
                        tone: 5,
                      },
                    ]
                  : []),
                {
                  id: "busy",
                  title: "Busy",
                  start: T(2, 8),
                  end: T(2, 9, 15),
                  busy: !0,
                },
                {
                  id: "billing",
                  title: "Focus: billing",
                  start: T(2, 13),
                  end: T(2, 15),
                  tone: 1,
                },
                {
                  id: "northwind",
                  title: "Northwind call",
                  start: T(3, 11),
                  end: T(3, 11, 45),
                  tone: 2,
                },
                {
                  id: "lunch",
                  title: "Lunch with Ana",
                  start: T(3, 12, 30),
                  end: T(3, 13, 30),
                  tone: 5,
                },
                {
                  id: "ship",
                  title: "Ship review",
                  start: T(4, 16),
                  end: T(4, 17),
                  tone: 3,
                },
              ]),
            days: "Day view" === e ? 1 : "auto",
            defaultDate: "Overlaps" === e ? T(1, 10) : void 0,
            height: "Day view" === e ? 380 : 400,
            onCreate: o,
            onUpdate: o,
            onDelete: o,
          },
          e,
        ),
      }),
      (0, t.jsx)("p", {
        className: "mt-3 px-1 text-[11.5px] text-muted-foreground",
        children:
          "Drag an empty slot to add, drag an event to move it, its edges to resize. On a phone, hold first.",
      }),
    ],
  });
});
