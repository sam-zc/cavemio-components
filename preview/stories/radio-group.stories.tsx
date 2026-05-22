import { Demo } from "../entries/radio-group";
export default {
  title: "Library/Inputs and forms/Radio group",
  component: Demo,
  argTypes: { initialTab: { control: "select", options: ["Cards", "List"] } },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Cards" } };
export const Mode1 = { args: { initialTab: "List" } };
