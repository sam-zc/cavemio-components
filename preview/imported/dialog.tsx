"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { Dialog } from "../../registry/components/dialog";

export function Demo() {
  const [message, setMessage] = useState("");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Dialog
          trigger={
            <button className="imported-demo-button">Delete project</button>
          }
          title="Delete this project?"
          description="This is a local preview. Try the dialog and its keyboard controls."
          footer={({ close }) => (
            <>
              <button className="imported-demo-button" onClick={close}>
                Cancel
              </button>
              <button
                className="imported-demo-button"
                onClick={() => {
                  setMessage("Project removed in this demo");
                  close();
                }}
              >
                Delete
              </button>
            </>
          )}
        />
        <p role="status" className="imported-demo-feedback">
          {message}
        </p>
      </div>
    </div>
  );
}
