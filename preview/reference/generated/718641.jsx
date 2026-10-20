"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency7 from "../../../registry/components/storage";
("use strict");
var A = dependency0;
var a = dependency1;
function g(props) {
  return dependency1.createElement(dependency7.Storage, props);
}
let c = (e) => new Promise((A) => setTimeout(A, e));
export default (function ({ tab: e = "Nearly full" }) {
  let [r, s] = a.default.useState("Plenty of room" === e ? 214e8 : 472e8),
    [l, t] = a.default.useState(5e10),
    [n, x] = a.default.useState(91e8),
    i = 0.42 * r,
    R = 0.33 * r;
  return (0, A.jsx)(
    g,
    {
      used: r,
      limit: l,
      roomy: l > 1e11,
      kinds: [
        { id: "photos", label: "Photos", bytes: i },
        { id: "video", label: "Video", bytes: R },
        { id: "docs", label: "Docs", bytes: r - i - R },
      ],
      cleanUpLabel: n > 0 ? "Empty trash" : "Trash is empty",
      onCleanUp: async () => {
        (await c(800), s((e) => Math.max(0, e - n)), x(0));
      },
      upgradeLabel: "Upgrade to 1 TB",
      onUpgrade: async () => {
        (await c(900), t(1e12));
      },
    },
    e,
  );
});
