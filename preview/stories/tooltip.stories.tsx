import { Demo } from "../entries/tooltip";
export default {
  title: "Library/Overlays and feedback/Tooltip",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Toolbar", "Sides"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Toolbar" } };
export const Mode1 = { args: { initialTab: "Sides" } };
