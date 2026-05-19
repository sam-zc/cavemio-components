import { Demo } from "../entries/icon-morph";
export default {
  title: "Library/Buttons and actions/Icon morph",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Modes", "Buttons", "Controls"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Modes" } };
export const Mode1 = { args: { initialTab: "Buttons" } };
export const Mode2 = { args: { initialTab: "Controls" } };
