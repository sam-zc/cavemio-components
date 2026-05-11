import { Demo } from "../entries/button-group";
export default {
  title: "Library/Buttons and actions/Button group",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Connected", "Solid", "Vertical"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Connected" } };
export const Mode1 = { args: { initialTab: "Solid" } };
export const Mode2 = { args: { initialTab: "Vertical" } };
