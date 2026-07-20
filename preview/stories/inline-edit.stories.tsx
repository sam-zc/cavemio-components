import { Demo } from "../entries/inline-edit";
export default {
  title: "Library/Inputs and forms/Inline edit",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Rename", "Server says no", "Renamed elsewhere"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Rename" } };
export const Mode1 = { args: { initialTab: "Server says no" } };
export const Mode2 = { args: { initialTab: "Renamed elsewhere" } };
