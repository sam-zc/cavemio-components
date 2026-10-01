import { Demo } from "../entries/create-password";
export default {
  title: "Library/Blocks/Create password",
  component: Demo,
  argTypes: {
    initialTab: {
      control: "select",
      options: ["Create", "Breached", "Not saved"],
    },
  },
};
export const Default = {};
export const Mode0 = { args: { initialTab: "Create" } };
export const Mode1 = { args: { initialTab: "Breached" } };
export const Mode2 = { args: { initialTab: "Not saved" } };
