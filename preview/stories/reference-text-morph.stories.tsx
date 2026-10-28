import { Demo } from "../entries/text-morph";
export default {
  title: "Reference demos/Motion and landing/Text Morph",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Labels", "Headline"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Labels" } };
export const Mode1 = { args: { initialTab: "Headline" } };
