"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency10 from "../../../registry/components/delete-workspace";
("use strict");
var s = dependency0;
function I(props) {
  return dependency1.createElement(dependency10.DeleteWorkspace, props);
}
let T = (e) => new Promise((s) => setTimeout(s, e));
export default (function ({ tab: e = "Delete" }) {
  return (0, s.jsx)(
    I,
    {
      name: "Northwind",
      consequences: [
        "12 projects and their history",
        "4 members lose access",
        "Billing stops today",
      ],
      onDelete: async () => {
        if ((await T(700), "Not deleted" === e))
          throw Error("Couldn’t delete it. Try again.");
      },
      onRestore: async () => {
        await T(700);
      },
    },
    e,
  );
});
