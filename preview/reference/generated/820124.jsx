"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency12 from "../../../registry/components/file-share";
("use strict");
var t = dependency0;
var r = dependency1;
function N(props) {
  return dependency1.createElement(dependency12.FileShare, props);
}
let S = [
  ["Q3 board deck.pdf", 482e4],
  ["Launch film — final.mp4", 384e5],
  ["Brand assets.zip", 126e5],
];
export default (function ({ tab: e = "Share" }) {
  let n = (0, r.useRef)(null),
    s = (0, r.useRef)(new Set());
  return (0, t.jsxs)("div", {
    className: "flex w-full flex-col items-center gap-3",
    children: [
      (0, t.jsx)(
        N,
        {
          ref: n,
          maxSize: 2e9,
          onUpload: (t, r) => {
            let n = "Upload drops" === e && !s.current.has(t.name);
            return (
              n && s.current.add(t.name),
              (function (e, { onProgress: t, signal: r }, n) {
                return new Promise((s, a) => {
                  let i = Math.min(3.2, 0.9 + e.size / 14e6),
                    o = performance.now(),
                    l = () => {
                      if (r.aborted)
                        return a(new DOMException("Aborted", "AbortError"));
                      let d = Math.min(1, (performance.now() - o) / (1e3 * i));
                      return (t(d), n && d > 0.55)
                        ? a(Error("Connection dropped"))
                        : d >= 1
                          ? s({ key: `uploads/${Date.now()}-${e.name}` })
                          : void window.setTimeout(l, 90);
                    };
                  l();
                });
              })(t, r, n)
            );
          },
          onCreateLink: async () => (
            await new Promise((e) => setTimeout(e, 900)),
            { url: "https://share.relay.so/f/8KQ2-vT4m" }
          ),
        },
        e,
      ),
      (0, t.jsx)("button", {
        type: "button",
        onClick: () =>
          n.current?.add(
            S.map(
              ([e, t]) =>
                new File([new Uint8Array(Math.min(t, 64))], e, {
                  type: "application/octet-stream",
                }),
            ).map((e, t) =>
              Object.defineProperty(e, "size", { value: S[t][1] }),
            ),
          ),
        className:
          "h-8 cursor-pointer rounded-full px-3 text-[12.5px] text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)] hover:bg-accent hover:text-foreground",
        children: "Add sample files",
      }),
    ],
  });
});
