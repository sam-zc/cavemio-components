import { Demo } from "../entries/popover";
export default {
  title: "Library/Overlays and feedback/Popover",
  component: Demo,
  argTypes: { initialTab: { control: "select", options: ["Form", "Details"] } },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Form" } };
export const Mode1 = { args: { initialTab: "Details" } };
