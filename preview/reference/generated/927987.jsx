"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency9 from "../../../registry/components/feedback";
("use strict");
var t = dependency0;
function j(props) {
  return dependency1.createElement(dependency9.Feedback, props);
}
export default (function ({ tab: e = "Net promoter" }) {
  let r = async (t) => {
    if ((await new Promise((e) => setTimeout(e, 900)), "Not sent" === e))
      throw Error("You’re offline. We’ll keep this until you’re back.");
  };
  return "Stars" === e
    ? (0, t.jsx)(
        j,
        {
          scale: "stars",
          question: "How was your order from Fernhill Supply?",
          prompts: {
            low: {
              question: "What went wrong?",
              tags: [
                "Arrived late",
                "Damaged",
                "Wrong size",
                "Not as pictured",
              ],
            },
            mid: {
              question: "What would make it better?",
              tags: ["Faster delivery", "Less packaging", "Better fit guide"],
            },
            high: {
              question: "What did you like?",
              tags: ["Fast delivery", "Packaging", "Quality", "Fit"],
            },
          },
          onSubmit: r,
          onDismiss: () => {},
        },
        e,
      )
    : (0, t.jsx)(
        j,
        {
          question: "How likely are you to recommend Relay to a friend?",
          onSubmit: r,
          onDismiss: () => {},
        },
        e,
      );
});
