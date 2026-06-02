import { Demo } from "../entries/slider";
export default {
  title: "Library/Inputs and forms/Slider",
  component: Demo,
  argTypes: { initialTab: { control: "select", options: ["Single", "Range"] } },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Single" } };
export const Mode1 = { args: { initialTab: "Range" } };
