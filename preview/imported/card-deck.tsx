"use client";

// Local interactive fixture; no application services are called.

import { CardDeck } from "../../registry/components/card-deck";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <CardDeck
          items={[
            { id: "capture", title: "Catch the little things." },
            { id: "connect", title: "Follow the thread." },
            { id: "share", title: "Make something together." },
          ]}
          getLabel={(card) => card.title}
          renderCard={(card) => (
            <div className="p-8">
              <h3>{card.title}</h3>
              <p className="mt-6">Drag a card or use the arrows.</p>
            </div>
          )}
        />
      </div>
    </div>
  );
}
