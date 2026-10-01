"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency7 from "../../../registry/components/cookie-consent";
("use strict");
var t = dependency0;
function w(props) {
  return dependency1.createElement(dependency7.CookieConsent, props);
}
export default (function ({ tab: A = "Choose" }) {
  return (0, t.jsx)(
    w,
    {
      policyHref: "#",
      onSave: async (t) => {
        if ((await new Promise((A) => setTimeout(A, 700)), "Not saved" === A))
          throw Error("Couldn’t save your choices. Try again.");
      },
    },
    A,
  );
});
