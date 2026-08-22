import { Demo } from "../entries/tag-input";
export default {
  title: "Library/Inputs and forms/Tag input",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Invite", "Paste a list", "Labels", "Seat limit"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Invite" } };
export const Mode1 = { args: { initialTab: "Paste a list" } };
export const Mode2 = { args: { initialTab: "Labels" } };
export const Mode3 = { args: { initialTab: "Seat limit" } };
