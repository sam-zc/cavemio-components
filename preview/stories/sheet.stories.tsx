import { Demo } from "../entries/sheet";
export default {
  title: "Library/Overlays and feedback/Sheet",
  component: Demo,
  argTypes: { initialTab: { control: "select", options: ["Right", "Bottom"] } },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Right" } };
export const Mode1 = { args: { initialTab: "Bottom" } };
