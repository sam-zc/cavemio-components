"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency2 from "lucide-react";
import * as dependency7 from "../../../registry/components/agent-composer";
("use strict");
var t = dependency0;
var r = dependency1;
var n = dependency2;
var a = dependency2;
var s = dependency2;
function z(props) {
  return dependency1.createElement(dependency7.AgentComposer, props);
}
let A = [
  {
    id: "aurora-mini",
    name: "Aurora Mini",
    description: "Fast, small edits",
    icon: (0, t.jsx)(s.Zap, {}),
    speed: 3,
    intelligence: 1,
  },
  {
    id: "aurora",
    name: "Aurora",
    description: "Balanced for most work",
    icon: (0, t.jsx)(a.Sparkle, {}),
    speed: 2,
    intelligence: 2,
  },
  {
    id: "aurora-think",
    name: "Aurora Think",
    description: "Plans before it changes code",
    icon: (0, t.jsx)(n.Brain, {}),
    speed: 1,
    intelligence: 3,
    reasoning: !0,
  },
];
export default (function () {
  let [e, n] = (0, r.useState)("ready"),
    [a, s] = (0, r.useState)("aurora"),
    [i, o] = (0, r.useState)("Medium"),
    [l, d] = (0, r.useState)(!1),
    [c, u] = (0, r.useState)(57e4),
    [m, p] = (0, r.useState)("main"),
    f = (0, r.useRef)([]);
  return (
    (0, r.useEffect)(
      () => () => f.current.forEach((e) => window.clearTimeout(e)),
      [],
    ),
    (0, t.jsx)("div", {
      className:
        "flex min-h-[340px] w-full max-w-[560px] flex-col justify-end py-4",
      children: (0, t.jsx)(z, {
        branch: m,
        folder: "kept-till",
        context: { used: c, limit: 1e6 },
        models: A,
        model: a,
        onModelChange: s,
        effort: i,
        onEffortChange: o,
        status: e,
        onSubmit: (e) => {
          (n("submitted"),
            "main" === m &&
              p(
                `agent/${e
                  .toLowerCase()
                  .replace(/[^a-z]+/g, "-")
                  .slice(0, 18)
                  .replace(/-$/, "")}`,
              ),
            f.current.push(
              window.setTimeout(() => n("streaming"), 700),
              window.setTimeout(() => {
                (n("ready"), u((e) => Math.min(1e6, e + 64e3)));
              }, 3200),
            ));
        },
        onStop: () => {
          (f.current.forEach((e) => window.clearTimeout(e)), n("ready"));
        },
        onFilesSelected: () => {},
        onVoice: () => d((e) => !e),
        listening: l,
        placeholder: "Ask Kept's agent to change something",
      }),
    })
  );
});
