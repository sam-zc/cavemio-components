"use client";

// Local interactive fixture; no application services are called.

import { useState } from "react";
import { Popover } from "../../registry/components/popover";

export function Demo() {
  const [value, setValue] = useState("Cavemio");
  const [message, setMessage] = useState("");
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <Popover
          label="Rename"
          trigger={
            <button className="imported-demo-button">Rename project</button>
          }
        >
          {({ close }) => (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setMessage("Renamed to " + value);
                close();
              }}
              className="grid gap-3 p-2"
            >
              <label>
                Project name
                <input
                  aria-label="Project name"
                  className="imported-demo-input"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </label>
              <button className="imported-demo-button">Save</button>
            </form>
          )}
        </Popover>
        <p role="status" className="imported-demo-feedback">
          {message}
        </p>
      </div>
    </div>
  );
}
