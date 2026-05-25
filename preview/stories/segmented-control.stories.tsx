import { Demo } from "../entries/segmented-control";
export default {
  title: "Library/Inputs and forms/Segmented control",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Views", "Icons", "Block"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Views" } };
export const Mode1 = { args: { initialTab: "Icons" } };
export const Mode2 = { args: { initialTab: "Block" } };
