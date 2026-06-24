import { Demo } from "../entries/button";
export default {
  title: "Library/Buttons and actions/Button",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Showcase", "Async state", "Sizes"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Showcase" } };
export const Mode1 = { args: { initialTab: "Async state" } };
export const Mode2 = { args: { initialTab: "Sizes" } };
