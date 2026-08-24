"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency5 from "../../../registry/components/task-log";
("use strict");
var t = dependency0;
var i = dependency1;
var s = dependency2;
var n = dependency2;
function g(props) {
  return dependency1.createElement(dependency5.TaskLog, props);
}
let y = [
  {
    id: "find",
    title: "Finding project files",
    doneTitle: "Found project files",
    icon: (0, t.jsx)(n.Search, {}),
    steps: [
      { id: "s1", text: 'Searching "app/page.tsx, components"' },
      { id: "s2", text: "Read", file: "page.tsx" },
      { id: "s3", text: "Scanning", detail: "52 files" },
      { id: "s4", text: "Read", file: "layout.tsx" },
    ],
  },
  {
    id: "toggle",
    title: "Adding the theme toggle",
    doneTitle: "Added the theme toggle",
    icon: (0, t.jsx)(s.FileCode2, {}),
    steps: [
      { id: "t1", text: "Created", file: "theme-toggle.tsx" },
      { id: "t2", text: "Wired it into", file: "layout.tsx" },
      { id: "t3", text: "Ran lint and type-check", detail: "0 errors" },
    ],
  },
];
let j = () => y.map((e) => ({ ...e, status: "done" }));
export default (function ({ tab: e = "Live" }) {
  let [s, n] = (0, i.useState)(0),
    [r, a] = (0, i.useState)("Live" === e ? [] : j());
  return (
    (0, i.useEffect)(() => {
      if ("Live" !== e) return;
      a([]);
      let t = [],
        i = 300;
      return (
        y.forEach((e, s) => {
          (t.push(
            window.setTimeout(
              () => a((t) => [...t, { ...e, status: "running", steps: [] }]),
              i,
            ),
          ),
            e.steps.forEach((e) => {
              ((i += 650),
                t.push(
                  window.setTimeout(
                    () =>
                      a((t) =>
                        t.map((t, i) =>
                          i === s ? { ...t, steps: [...t.steps, e] } : t,
                        ),
                      ),
                    i,
                  ),
                ));
            }),
            (i += 700),
            t.push(
              window.setTimeout(
                () =>
                  a((e) =>
                    e.map((e, t) => (t === s ? { ...e, status: "done" } : e)),
                  ),
                i,
              ),
            ),
            (i += 300));
        }),
        () => t.forEach((e) => window.clearTimeout(e))
      );
    }, [e, s]),
    (0, t.jsx)("div", {
      className: "w-full max-w-[440px] py-2",
      children: (0, t.jsx)(g, {
        tasks: r,
        onRerun: () => ("Live" === e ? n((e) => e + 1) : a(j())),
      }),
    })
  );
});
