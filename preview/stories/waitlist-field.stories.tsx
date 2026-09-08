import { Demo } from "../entries/waitlist-field";
export default {
  title: "Library/Inputs and forms/Waitlist field",
  component: Demo,
  argTypes: {
    initialTab: { control: "select", options: ["Join", "Error", "Joined"] },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Join" } };
export const Mode1 = { args: { initialTab: "Error" } };
export const Mode2 = { args: { initialTab: "Joined" } };
