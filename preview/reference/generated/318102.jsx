"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency3 from "../../../registry/components/radio-group";
("use strict");
var a = dependency0;
function t(props) {
  return dependency1.createElement(dependency3.RadioGroup, props);
}
export default (function ({ tab: e = "Cards" }) {
  return "List" === e
    ? (0, a.jsx)("div", {
        className: "w-full max-w-[300px]",
        children: (0, a.jsx)(t, {
          label: "Delivery",
          showLabel: !0,
          defaultValue: "standard",
          options: [
            {
              value: "standard",
              label: "Standard",
              description: "3 to 5 days",
            },
            {
              value: "express",
              label: "Express",
              description: "Next working day",
            },
            {
              value: "collect",
              label: "Collect in store",
              description: "Kept, Brick Lane",
            },
          ],
        }),
      })
    : (0, a.jsx)("div", {
        className: "w-full max-w-[340px]",
        children: (0, a.jsx)(t, {
          label: "Plan",
          variant: "cards",
          defaultValue: "all",
          options: [
            {
              value: "one",
              label: "One template",
              description: "Yours to keep, with updates",
              aside: "$39",
            },
            {
              value: "all",
              label: "All access",
              description: "Every template, every update",
              aside: "$149",
            },
            {
              value: "free",
              label: "Components only",
              description: "The free library",
              aside: "Free",
            },
          ],
        }),
      });
});
