"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { Cart } from "../../registry/components/cart";

export function Demo() {
  const [value, setValue] = useState([
    {
      id: "linen",
      name: "Linen overshirt",
      price: 89,
      quantity: 1,
      variant: "Sand · Medium",
    },
    {
      id: "tote",
      name: "Everyday tote",
      price: 24,
      quantity: 2,
      variant: "Natural",
    },
  ]);
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Cart
          items={value}
          shipping={8}
          freeShippingAt={250}
          onQuantityChange={async (id, quantity) =>
            setValue(
              value.map((item) =>
                item.id === id ? { ...item, quantity } : item,
              ),
            )
          }
          onRemove={async (id) =>
            setValue(value.filter((item) => item.id !== id))
          }
          onCheckout={async () => {
            await new Promise((resolve) => setTimeout(resolve, 650));
          }}
        />
      </div>
    </div>
  );
}
