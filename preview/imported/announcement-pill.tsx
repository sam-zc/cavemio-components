"use client";

// Local interactive fixture; no application services are called.

import { AnnouncementPill } from "../../registry/components/announcement-pill";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <AnnouncementPill
          more="Read the changelog"
          card={
            <div className="p-5">
              <strong>New components</strong>
              <p>More ways to build with motion.</p>
            </div>
          }
        >
          The library just got bigger
        </AnnouncementPill>
      </div>
    </div>
  );
}
