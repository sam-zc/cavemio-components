"use client";

// Local interactive fixture; no application services are called.

import { BuyBox } from "../../registry/components/buy-box";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <BuyBox
          name="Linen overshirt"
          options={[
            {
              id: "size",
              label: "Size",
              values: [
                { id: "S", label: "S" },
                { id: "M", label: "M" },
                { id: "L", label: "L" },
              ],
            },
          ]}
          variants={[
            { id: "s", options: { size: "S" }, price: 89, stock: 4 },
            { id: "m", options: { size: "M" }, price: 89, stock: 12 },
            { id: "l", options: { size: "L" }, price: 89, stock: 0 },
          ]}
          onAddToCart={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
          onNotify={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
