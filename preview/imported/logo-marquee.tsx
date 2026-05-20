"use client";

// Local interactive fixture; no application services are called.

import { LogoMarquee } from "../../registry/components/logo-marquee";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <LogoMarquee
          logos={["Acme", "Orbit", "Layers", "North", "Studio"].map((name) => (
            <span
              key={name}
              className="px-8 text-xl font-semibold tracking-tight"
            >
              {name}
            </span>
          ))}
        />
      </div>
    </div>
  );
}
