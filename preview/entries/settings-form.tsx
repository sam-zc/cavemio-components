"use client";
import Scene from "../reference/generated/850622.jsx";
import {
  ReferenceDemo,
  type ReferenceDemoProps,
} from "../reference/reference-demo";
export function Demo(props: ReferenceDemoProps = {}) {
  return <ReferenceDemo {...props} name="settings-form" Scene={Scene} />;
}
