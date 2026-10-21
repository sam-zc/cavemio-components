"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency6 from "../../../registry/components/username";
("use strict");
var r = dependency0;
function g(props) {
  return dependency1.createElement(dependency6.Username, props);
}
let h = new Set(["ana", "admin", "relay", "sam", "alex", "hello"]);
export default (function ({ tab: e = "Pick" }) {
  return (0, r.jsx)(
    g,
    {
      defaultValue: "Taken" === e ? "ana" : "",
      check: async (e, r) =>
        (await new Promise((e, t) => {
          let a = setTimeout(e, 450);
          r.addEventListener(
            "abort",
            () => (
              clearTimeout(a),
              t(new DOMException("Aborted", "AbortError"))
            ),
          );
        }),
        h.has(e))
          ? {
              available: !1,
              suggestions: [`${e}_codes`, `${e}builds`, `its${e}`].filter(
                (e) => !h.has(e),
              ),
            }
          : { available: !0 },
      onClaim: async () => {
        await new Promise((e) => setTimeout(e, 700));
      },
    },
    e,
  );
});
