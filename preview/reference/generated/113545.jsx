"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "../../../registry/components/password-input";
("use strict");
var t = dependency0;
var r = dependency1;
export default (function ({ tab: e = "Sign in" }) {
  return "New password" === e
    ? (0, t.jsx)("div", {
        className: "w-full max-w-[320px]",
        children: (0, t.jsx)(r.PasswordInput, {
          label: "New password",
          strength: !0,
          autoComplete: "new-password",
          hint: "12 characters or more is best.",
        }),
      })
    : (0, t.jsx)("div", {
        className: "w-full max-w-[320px]",
        children: (0, t.jsx)(r.PasswordInput, {
          label: "Password",
          defaultValue: "kept-ice-cream-42",
        }),
      });
});
