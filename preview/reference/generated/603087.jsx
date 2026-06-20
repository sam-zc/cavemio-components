"use client";

// Reusable UI is imported from canonical Cavemio source.
import * as dependency0 from "react/jsx-runtime";
import * as dependency1 from "react";
import * as dependency6 from "../../../registry/components/approval-card";
("use strict");
var t = dependency0;
var r = dependency1;
function x(props) {
  return dependency1.createElement(dependency6.ApprovalCard, props);
}
export default (function ({ tab: e = "Pending" }) {
  let [n] = (0, r.useState)(() => Date.now() + ("Expired" === e ? 7e3 : 161e3));
  return "Destructive" === e
    ? (0, t.jsx)("div", {
        className: "w-full max-w-[420px]",
        children: (0, t.jsx)(x, {
          title: "Delete 214 files from /archive",
          description:
            "The cleanup agent wants to permanently remove last year’s exports.",
          details: [
            { label: "Folder", value: "/archive/2025" },
            { label: "Size", value: "3.2 GB" },
          ],
          approveLabel: "Delete files",
          denyLabel: "Keep them",
          destructive: !0,
          expiresAt: n,
        }),
      })
    : (0, t.jsx)("div", {
        className: "w-full max-w-[420px]",
        children: (0, t.jsx)(x, {
          title: "Send email to 3 people",
          description:
            "The agent drafted a follow-up to Thursday’s tasting and wants to send it from your address.",
          details: [
            { label: "To", value: "maya@scoopco.com, +2 more" },
            { label: "Subject", value: "Thursday tasting menu" },
          ],
          reason: "Sending email on your behalf always needs a yes from you.",
          approveLabel: "Send",
          denyLabel: "Don’t send",
          status:
            "Approved" === e ? "approved" : "Denied" === e ? "denied" : void 0,
          expiresAt: "Expired" === e ? n : void 0,
        }),
      });
});
