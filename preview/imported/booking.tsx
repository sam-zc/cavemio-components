"use client";

// Local interactive fixture; no application services are called.

import { Booking } from "../../registry/components/booking";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Booking
          host={{ name: "Maya Chen", role: "Product designer" }}
          title="A short introduction"
          duration={30}
          location="Video call"
          getSlots={async ({ from, to }, signal) => {
            const slots: Date[] = [];
            for (
              const day = new Date(from);
              day < to;
              day.setDate(day.getDate() + 1)
            ) {
              for (const hour of [9, 10, 14]) {
                const slot = new Date(day);
                slot.setHours(hour, 0, 0, 0);
                if (slot.getTime() > Date.now()) slots.push(slot);
              }
            }
            return signal.aborted ? [] : slots;
          }}
          onBook={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
