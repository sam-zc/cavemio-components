"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency9 from "../../../registry/components/verify-code";
("use strict");
var t = dependency0;
function W(props) {
  return dependency1.createElement(dependency9.VerifyCode, props);
}
let H = (e) => new Promise((t) => setTimeout(t, e));
export default (function ({ tab: e = "Verify" }) {
  return (0, t.jsx)(
    W,
    {
      destination: "ana@northwind.co",
      resendAfter: 8,
      onVerify: async () => (await H(700), "Wrong code" !== e),
      onResend: async () => {
        if ((await H(900), "Resend fails" === e)) throw Error("Rate limited");
        return { retryAfter: 8 };
      },
      onChangeDestination: () => {},
    },
    e,
  );
});
