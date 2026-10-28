import { Demo } from "../entries/select";
export default {
  title: "Reference demos/Inputs and forms/Select",
  component: Demo,
  argTypes: { initialTab: { control: "select", options: ["Field", "Inline"] } },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Field" } };
export const Mode1 = { args: { initialTab: "Inline" } };
