import { Demo } from "../entries/copy-button";
export default {
  title: "Library/Buttons and actions/Copy button",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Icon Only", "With Label", "Outline", "Sizes"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Icon Only" } };
export const Mode1 = { args: { initialTab: "With Label" } };
export const Mode2 = { args: { initialTab: "Outline" } };
export const Mode3 = { args: { initialTab: "Sizes" } };
