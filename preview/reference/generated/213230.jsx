"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency8 from "../../../registry/components/waitlist";
("use strict");
var s = dependency0;
var t = dependency1;
function I(props) {
  return dependency1.createElement(dependency8.Waitlist, props);
}
export default (function ({ tab: e = "Join" }) {
  let [r, A] = t.default.useState(void 0),
    [a, l] = t.default.useState(0),
    [i, n] = t.default.useState(!1),
    o = t.default.useRef([]);
  return (
    t.default.useEffect(
      () => () => o.current.forEach((e) => window.clearTimeout(e)),
      [],
    ),
    (0, s.jsx)(
      I,
      {
        product: "Relay",
        position: r,
        referrals: a,
        admitted: i,
        onJoin: async (s) => {
          if (
            (await new Promise((e) => setTimeout(e, 700)),
            s.startsWith("taken"))
          )
            throw Error("That email is already in line.");
          A(4812);
          let t = (e, s) => o.current.push(window.setTimeout(s, e));
          return (
            "Admitted" === e
              ? t(2200, () => n(!0))
              : (t(2600, () => (l(1), A(4762))),
                t(5600, () => (l(2), A(4712)))),
            { position: 4812, link: "relay.app/w/ana-7Kq2" }
          );
        },
      },
      e,
    )
  );
});
