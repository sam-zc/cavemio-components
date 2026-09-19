"use client";

// Local interactive fixture; no application services are called.

import { AvatarCropper } from "../../registry/components/avatar-cropper";

export function Demo() {
  return (
    <div className="cavemio-demo imported-demo">
      <div className="imported-demo-stage">
        <AvatarCropper
          name="Ada Okafor"
          onSave={async (photo) => URL.createObjectURL(photo)}
        />
      </div>
    </div>
  );
}
