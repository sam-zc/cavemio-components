"use client";

// Local interactive fixture; no application services are called.

import { TagInput } from "../../registry/components/tag-input";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <TagInput
          label="Invite by email"
          placeholder="Names or emails"
          separators={/[\s,;]+/}
          normalize={(v) => v.toLowerCase()}
          validate={(v) =>
            /^\S+@\S+\.\S+$/.test(v) ? null : "Enter an email address"
          }
        />
      </div>
    </div>
  );
}
