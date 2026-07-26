"use client";

// Local interactive fixture; no application services are called.

import { MagnifyingDock } from "../../registry/components/magnifying-dock";
import { Inbox, CalendarDays, NotebookPen } from "lucide-react";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <MagnifyingDock
          items={[
            {
              id: "inbox",
              label: "Inbox",
              icon: <Inbox />,
              badge: 3,
              content: <div className="p-5">Three new messages.</div>,
            },
            {
              id: "calendar",
              label: "Calendar",
              icon: <CalendarDays />,
              content: <div className="p-5">Design review · 2:00 PM</div>,
            },
            {
              id: "notes",
              label: "Notes",
              icon: <NotebookPen />,
              content: <div className="p-5">A good idea starts here.</div>,
            },
          ]}
        />
      </div>
    </div>
  );
}
