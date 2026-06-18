import { Demo } from "../entries/action-button";
export default {
  title: "Library/Buttons and actions/Action button",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Async", "Controlled", "Destructive"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Async" } };
export const Mode1 = { args: { initialTab: "Controlled" } };
export const Mode2 = { args: { initialTab: "Destructive" } };
