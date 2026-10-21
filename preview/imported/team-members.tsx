"use client";

// Local interactive fixture; no application services are called.

import { TeamMembers } from "../../registry/components/team-members";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <TeamMembers
          defaultValue={[
            {
              id: "ada",
              name: "Ada Okafor",
              email: "ada@example.com",
              role: "admin",
              status: "active",
            },
            {
              id: "kai",
              name: "Kai Morgan",
              email: "kai@example.com",
              role: "member",
              status: "active",
            },
          ]}
          roles={[
            {
              value: "admin",
              label: "Admin",
              description: "Manage the workspace",
            },
            {
              value: "member",
              label: "Member",
              description: "Create and edit projects",
            },
          ]}
          seats={10}
          onInvite={async (emails) =>
            emails.map((email, i) => ({
              id: "invite-" + i,
              name: email,
              email,
              role: "member",
              status: "invited" as const,
            }))
          }
          onRoleChange={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
          onRemove={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
          onResend={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
