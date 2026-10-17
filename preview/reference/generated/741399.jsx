"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency10 from "../../../registry/components/pricing-plans";
("use strict");
var r = dependency0;
function v(props) {
  return dependency1.createElement(dependency10.PricingPlans, props);
}
let j = [
  {
    id: "hobby",
    name: "Hobby",
    description: "For trying Relay on a side project.",
    price: { monthly: 0, yearly: 0 },
    features: ["1 workspace", "3 projects", "Community support"],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For founders shipping every week.",
    price: { monthly: 24, yearly: 19 },
    perSeat: !0,
    featured: !0,
    badge: "Most popular",
    features: [
      "Unlimited projects",
      "Custom domains",
      "Analytics",
      "Priority support",
    ],
  },
  {
    id: "team",
    name: "Team",
    description: "For small teams that share work.",
    price: { monthly: 48, yearly: 39 },
    perSeat: !0,
    minSeats: 3,
    features: [
      "Everything in Pro",
      "Shared workspace",
      "Roles and SSO",
      "Audit log",
    ],
  },
];
export default (function ({ tab: e = "Plans" }) {
  let t = async (r) => {
    if ((await new Promise((e) => setTimeout(e, 1200)), "Declined" === e))
      throw Error(
        "Couldn’t reach the payment provider. Try again in a moment.",
      );
  };
  return (0, r.jsx)("div", {
    className: "w-full max-w-[960px]",
    children: (0, r.jsx)(v, {
      plans: j,
      onCheckout: t,
      currentPlanId: "Current plan" === e ? "pro" : void 0,
      locale: "en-US",
    }),
  });
});
