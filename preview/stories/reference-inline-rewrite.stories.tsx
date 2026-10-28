import { Demo } from "../entries/inline-rewrite";
export default {
  title: "Reference demos/AI and agents/Inline Rewrite",
  component: Demo,
  argTypes: { initialTab: { control: "select", options: ["Length", "Tone"] } },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Length" } };
export const Mode1 = { args: { initialTab: "Tone" } };
