"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency7 from "../../../registry/components/create-password";
("use strict");
var t = dependency0;
function O(props) {
  return dependency1.createElement(dependency7.CreatePassword, props);
}
let F = (e) => new Promise((t) => setTimeout(t, e));
let C = {
  "Password1!": 2413,
  "Passw0rd!": 3412,
  "Welcome1!": 1874,
  "Qwerty123!": 965,
};
export default (function ({ tab: e = "Create" }) {
  return (0, t.jsx)(
    O,
    {
      username: "ana@northwind.co",
      checkBreaches: async (t, s) =>
        (await F(300), s.aborted)
          ? 0
          : "Breached" === e
            ? (C[t] ?? 1286)
            : (C[t] ?? 0),
      onSubmit: async () => {
        if ((await F(800), "Not saved" === e))
          throw Error("Couldn’t reach the server. Try again.");
      },
    },
    e,
  );
});
