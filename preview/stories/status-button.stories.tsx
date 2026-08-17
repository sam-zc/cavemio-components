import { Demo } from "../entries/status-button";
export default {
  title: "Library/Buttons and actions/Status button",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Save", "Copy", "Error"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Save" } };
export const Mode1 = { args: { initialTab: "Copy" } };
export const Mode2 = { args: { initialTab: "Error" } };
