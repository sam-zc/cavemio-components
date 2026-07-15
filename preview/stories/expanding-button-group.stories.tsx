import { Demo } from "../entries/expanding-button-group";
export default {
  title: "Library/Buttons and actions/Expanding button group",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Toolbar", "Tones", "Confirm"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Toolbar" } };
export const Mode1 = { args: { initialTab: "Tones" } };
export const Mode2 = { args: { initialTab: "Confirm" } };
