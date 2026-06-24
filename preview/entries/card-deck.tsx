"use client";
import Scene from "../reference/generated/103050.jsx";
import {
  ReferenceDemo,
  type ReferenceDemoProps,
} from "../reference/reference-demo";
export function Demo(props: ReferenceDemoProps = {}) {
  return <ReferenceDemo {...props} name="card-deck" Scene={Scene} />;
}
