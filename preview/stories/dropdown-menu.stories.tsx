import { Demo } from "../entries/dropdown-menu";
export default {
  title: "Library/Overlays and feedback/Dropdown menu",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Actions", "View options"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Actions" } };
export const Mode1 = { args: { initialTab: "View options" } };
