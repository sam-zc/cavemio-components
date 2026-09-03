"use client";

// Local interactive fixture; no application services are called.

import { Toaster, toast } from "../../registry/components/toast-stack";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <button
          className="imported-demo-button"
          onClick={() => toast.success("Changes saved")}
        >
          Show toast
        </button>
        <button
          className="imported-demo-button"
          onClick={() =>
            toast("Project archived", {
              action: {
                label: "Undo",
                onClick: () => toast.success("Project restored"),
              },
            })
          }
        >
          Show undo toast
        </button>
        <Toaster position="bottom-right" />
      </div>
    </div>
  );
}
